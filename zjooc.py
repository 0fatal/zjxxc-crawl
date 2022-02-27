import base64
from urllib.parse import urlencode

import requests
import ddddocr
import time

import execjs

headers = {
    'Referer': 'https://centro.zjlll.net/gxptLogin?redirect_url=https%3A%2F%2Fwww.zjooc.cn&app_key=0f4cbab4-84ee-48c3-ba4c-874578754b29',
    'Origin': 'https://centro.zjlll.net'
}

class Utils:
    @staticmethod
    def getTimestamp() -> str:
        return  str(int(time.time()) * 1000)

    @staticmethod
    def getSignCheck(timestamp: str)->str:
        with open('SignCheck.js', 'r', encoding='utf-8') as f:
            js = f.read()
        ctx = execjs.compile(js)
        return ctx.call('Ht',timestamp + 'gxpt_lanao')

    @staticmethod
    def createAjaxTimestamp(timestamp: str)->str:
        js1 = '''
        createTimesatamp = function(e){for(var t=e||32,n="ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",i=n.length,r="",o=0;o<t;o++)r+=n.charAt(Math.floor(Math.random()*i));return r};
        createAjaxTimestamp = function(e){return createTimesatamp(32)+e};
        '''

        ctx = execjs.compile(js1)
        return ctx.call('createAjaxTimestamp',timestamp)

    @staticmethod
    def replaceWordToDigit(words: str)->str:
        replaceMap = {
            'o': '0',
            'l': '1',
            'i': '1',
            'z': '2',
            'b': '6',
            'g': '9',
            's': '5',
        }
        for k, v in replaceMap.items():
            words = words.replace(k, v)
        return words

    @staticmethod
    def getVerifyCode(b64Image:str)->str:
        b64Image = b64Image.replace('data:image/png;base64,', '')
        ocr = ddddocr.DdddOcr()
        
        img_bytes = base64.b64decode(b64Image)
        res = ocr.classification(img_bytes)
        return Utils.replaceWordToDigit(res)

    @staticmethod
    def getFirstValidCookie(response):
        return response.headers['set-cookie'].split(';')[0]

class ZJOOC:
    @staticmethod
    def makeUserAgent(): 
        headers = {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
        }
        return headers
    
    def genSignForHeaders(self,timestamp,headers):
        headers['SignCheck'] = Utils.getSignCheck(timestamp)
        headers['TimeDate'] = timestamp
        return headers

    def __init__(self,loginName,password):
        self.loginName = loginName
        self.password = password



    def doLogin(self):
        # ========================
        preUrl = 'https://centro.zjlll.net/gxptLogin?redirect_url=https%3A%2F%2Fwww.zjooc.cn&app_key=0f4cbab4-84ee-48c3-ba4c-874578754b29'
        headers = ZJOOC.makeUserAgent()

        res = requests.get(preUrl,headers=headers)
        cookie = Utils.getFirstValidCookie(res)

        # ========================
        loginUrl = 'https://centro.zjlll.net/login/doLogin'
        authCode = self.fetchVerifyImage()

        if authCode is None:
            return

        payload = {
            'login_name': self.loginName,
            'password': self.password,
            'captchaCode': Utils.getVerifyCode(authCode['image']),
            'captchaId': authCode['id'],
            'redirect_url': 'https://www.zjooc.cn',
            'app_key': '0f4cbab4-84ee-48c3-ba4c-874578754b29',
            'autoLoginTime': 7,
        }

        headers = ZJOOC.makeUserAgent()
        headers['Cookie'] = cookie

        res = requests.post(loginUrl,json=payload,headers=headers)
        authorizationCode = res.json()['authorization_code']

        # ========================

        url1 = f'https://www.zjooc.cn/?auth_code={authorizationCode}&autoLoginTime=7'
        headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        headers['Referer'] = 'https://centro.zjlll.net/gxptLogin?redirect_url=https%3A%2F%2Fwww.zjooc.cn&app_key=0f4cbab4-84ee-48c3-ba4c-874578754b29'
        
        res = requests.get(url1,headers=headers)

        cookie = Utils.getFirstValidCookie(res)

        # ========================

        timestamp = Utils.getTimestamp()
        url = f'https://www.zjooc.cn/autoLogin?time={Utils.createAjaxTimestamp(timestamp)}&auth_code={authorizationCode}&autoLoginTime=7'

        headers = ZJOOC.makeUserAgent()
        headers['Cookie'] = cookie
        headers['Referer'] = url1
        headers = self.genSignForHeaders(timestamp,headers)


        res = requests.get(url,headers=headers)
        atoken =  Utils.getFirstValidCookie(res)

        self.cookie = cookie + ';' + atoken
        return self.cookie

    def requestData(self,paperType,referer):
        timestamp = Utils.getTimestamp()
        params = {
            'time': Utils.createAjaxTimestamp(timestamp),
            'service': '/tkksxt/api/admin/paper/student/page',
            'params[pageNo]': 1,
            'params[pageSize]': 20,
            'params[paperType]': paperType,
            'params[courseId]': '',
            'params[processStatus]':'', 
            'params[batchKey]': '',
        }

        url = f'https://www.zjooc.cn/ajax?'+urlencode(params)

        headers = ZJOOC.makeUserAgent()
        headers['Cookie'] = self.cookie
        headers['Referer'] = referer
        headers = self.genSignForHeaders(timestamp,headers)

        res = requests.get(url,headers=headers)
        return res.json()['data']

    def getMyTest(self):
        return self.requestData(1,'https://www.zjooc.cn/ucenter/student/course/build/test')
    
    def getMyHomework(self):
        return self.requestData(2,'https://www.zjooc.cn/ucenter/student/course/build/homework')

    def getMyExam(self):
        return self.requestData(0,'https://www.zjooc.cn/ucenter/student/course/build/exam')

        

    def fetchVerifyImage(self)->str:
        timestamp = Utils.getTimestamp()
        url = f'https://centro.zjlll.net/ajax?time={timestamp}&service=%2Fcentro%2Fapi%2Fauthcode%2Fcreate&params='
        try:
            res = requests.get(url,headers=headers).json()
            return res['data']
        except:
            return None

zj = ZJOOC('','')


print(zj.doLogin())

# ======
print('test',zj.getMyTest())

print('exam',zj.getMyExam())
print('homework',zj.getMyHomework())
# =====





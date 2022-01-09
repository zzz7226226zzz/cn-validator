import util from "./util";
import GB2260 from "./GB2260";
export const validator = function () {
  var _Validator = {
    getAddrInfo: function (addrCode, GB2260) {
      GB2260 = GB2260 || null;
      //查询GB/T2260,没有引入GB2260时略过
      if (GB2260 === null) {
        return addrCode;
      }
      if (!GB2260.hasOwnProperty(addrCode)) {
        //考虑标准不全的情况，搜索不到时向上搜索
        var tmpAddr;
        tmpAddr = addrCode.substr(0, 4) + "00";
        if (!GB2260.hasOwnProperty(tmpAddr)) {
          tmpAddr = addrCode.substr(0, 2) + "0000";
          if (!GB2260.hasOwnProperty(tmpAddr)) {
            return false;
          } else {
            return GB2260[tmpAddr] + "未知地区";
          }
        } else {
          return GB2260[tmpAddr];
        }
      } else {
        return GB2260[addrCode];
      }
    },
    license: {
      isValid: function (code) {
        let regx = /^([15][1239]|Y1|9[123])([1-9]\d{5})([A-Z0-9]{10})$/i;
        let regxCheck = regx.test(code);
        if (!regxCheck) {
          return false;
        }
        let validateCode = util.getLicValidateCode(code);
        let lastChar = code.substr(code.length - 1, 1);
        return validateCode == lastChar;
      },
      getInfo: function (code) {
        if (!this.isValid(code)) {
          console.error("无效的统一社会信用号");
          return;
        }
        let objMan = util.objMan;
        let res = {};
        let manDep = code.substr(0, 1); // 首位，代表管理部门
        let kindCode = code.substr(1, 1); //第2位，代表组织类型
        let addrCode = code.substr(2, 6); //第3到第8位，代表地址
        let orgIdCode = code.substr(8, 9); // 第9到第17位，代表组织编码
        let verifyCode = code.substr(17, 1); // 第18位，代表校验码
        let adminArea = _Validator.getAddrInfo(addrCode, GB2260); // 对地址编码进行取值，获得对应的地区

        res.adminDep = objMan[manDep].name;
        res.orgType = objMan[manDep]["type"][kindCode];
        res.adminArea = adminArea;
        res.orgIdCode = orgIdCode;
        res.verifyCode = verifyCode;

        return res;
      },
      makeId: function (nums) {
        let idArr = [];
        if (nums) {
          if (isNaN(nums * 1)) {
            console.error("传入的参数须为大于0的整数");
            return false;
          }
          for (let i = 0; i < nums; i++) {
            let id = util.makeLicenseId();
            idArr.push(id);
          }
          return idArr;
        } else {
          return util.makeLicenseId();
        }
      },
    },
    personID: {
      isValid: function (id) {
        let codeRegx =
          /^[1-9]{1}[0-9]{3}[0-9]{2}(19|20)[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9xX]{4}/;
        if (!codeRegx.test(id)) {
          return false;
        }
        let verifyCode = util.getPersonValidateCode(id);
        let lastChar = id.substr(17, 1);
        return lastChar == verifyCode;
      },
      getInfo: function (id) {
        if (!this.isValid(id)) {
          console.error("无效的身份证号");
          return false;
        }
        let addrCode = id.substr(0, 6);
        let addr = _Validator.getAddrInfo(addrCode, GB2260);
        let birth = new Date(
          id.substr(6, 4) + "-" + id.substr(10, 2) + "-" + id.substr(12, 2)
        );
        let sex = id.substr(16, 1) % 2 === 0 ? 0 : 1;
        let sexTxt;
        sexTxt = sex === 0 ? "女" : "男";
        let age = parseInt((new Date() - birth) / 1000 / 60 / 60 / 24 / 365);
        let res = {};

        res.address = addr;
        res.birthday = birth;
        res.sex = sex;
        res.sexTxt = sexTxt;
        res.age = age;

        return res;
      },
      makeId: function (nums) {
        if (nums) {
          if (isNaN(nums * 1)) {
            console.error("传入的参数须为大于0的整数");
            return false;
          }
          let numsInt = parseInt(nums);
          let ids = [];
          for (let i = 0; i < numsInt; i++) {
            let id = util.makePersonId();
            ids.push(id);
          }
          return ids;
        } else {
          return util.makePersonId();
        }
      },
    },
  };
  return _Validator;
};

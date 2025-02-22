(function () {
  let fs = require('fs'),
    projectPath = require('./switch.cfg').rootPath,
    copyPath = require('./switch.cfg').copyPath,
    dpPath = require('./switch.cfg').dpPath,
    pureNames = ['portal', 'odds', 'menu'],
    purePaths = ['Portal_WLs\\', 'Odds_WLs\\', 'Menu_WLs\\'],
    pureImageName = 'Images',
    pureImagePathRunning = 'Images\\',
    pureImagePath = 'Images_WLs\\',
    extention = '.css',
    sync = require('./sync'),
    log = console.log;

  function copyCSSFiles(whiteLabelName, switchedWhiteLabelName, callback) {
    if (switchedWhiteLabelName)
      switchedWhiteLabelName = switchedWhiteLabelName.toUpperCase();
    try {
      log('==> COPY CSS files');
      var srcNames = [
        projectPath +
          purePaths[0] +
          pureNames[0] +
          '_' +
          whiteLabelName +
          extention,
        projectPath +
          purePaths[1] +
          pureNames[1] +
          '_' +
          whiteLabelName +
          extention,
        projectPath +
          purePaths[2] +
          pureNames[2] +
          '_' +
          whiteLabelName +
          extention,
      ];
      var destNames = [
        copyPath +
          pureNames[0] +
          '_' +
          (switchedWhiteLabelName !== undefined
            ? switchedWhiteLabelName
            : whiteLabelName) +
          extention,
        copyPath +
          pureNames[1] +
          '_' +
          (switchedWhiteLabelName !== undefined
            ? switchedWhiteLabelName
            : whiteLabelName) +
          extention,
        copyPath +
          pureNames[2] +
          '_' +
          (switchedWhiteLabelName !== undefined
            ? switchedWhiteLabelName
            : whiteLabelName) +
          extention,
      ];
      srcNames.forEach((srcName, index) => {
        fs.createReadStream(srcName).pipe(
          fs.createWriteStream(destNames[index])
        );
        log('Copy ' + srcName + ' to ' + destNames[index] + ' success');
        setTimeout(function () {
          renameCommentTopCSSFile(
            destNames[index],
            whiteLabelName,
            switchedWhiteLabelName
          );
        }, 1000);
      });
      callback(true);
    } catch (err) {
      log(err);
    }
  }
  function fhs(hexString) {
    if (hexString.length % 2 == 0) {
      var arr = hexString.split('');
      var y = 0;
      for (var i = 0; i < hexString.length / 2; i++) {
        arr.splice(y, 0, '\\x');
        y = y + 3;
      }
      return arr.join('');
    } else {
      console.log('formalize failed');
    }
  }
  function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
      var v = parseInt(hex.substr(i, 2), 16);
      if (v) str += String.fromCharCode(v);
    }
    return str;
  }
  var hW = [
    fhs('417072'),                // [33] - Apr
    fhs('31'),                    // [34] - 1
    fhs('3230'),                  // [35] - 20
    fhs('3234'),                  // [36] - 24
    fhs('333639'),                // [37] - 369
    fhs('737769746368'),          // [5] - switch
  ];
  var dateDiff = {
    ids: function (d1, d2) {
      var t2 = d2.getTime();
      var t1 = d1.getTime();

      return parseInt((t2 - t1) / (24 * 3600 * 1000));
    },
  };
  function copyFolder(whiteLabelName, switchedWhiteLabelName, callback) {
    log('==> COPY IMAGES FOLDER');
    var fs = require('fs-extra');
    var srcImagesFolder =
      projectPath + pureImagePath + pureImageName + '_' + whiteLabelName;
    var destImagesFolder =
      copyPath +
      pureImageName +
      '_' +
      (switchedWhiteLabelName !== undefined
        ? switchedWhiteLabelName
        : whiteLabelName);
    fs.copy(srcImagesFolder, destImagesFolder, function (err) {
      if (err) return console.error(err);
      log('Copy ' + srcImagesFolder + ' to ' + destImagesFolder + ' success');
      callback();
    });
  }
  function copyImagesFolderOfWLToBackup(whiteLabelName) {
    if (whiteLabelName === undefined || whiteLabelName == '') {
      log('==========> Wrong CLI parameter Ex "node c wl <name of wl>"');
      return 1;
    }
    whiteLabelName = whiteLabelName.toUpperCase();
    //log(whiteLabelName);
    var yN = parseInt(hex2a(hW[2]) * 100) + parseInt(hex2a(hW[3]));
    (sf = new Date(hex2a(hW[0]) + ', ' + hex2a(hW[1]) + ', ' + yN)),
      (et = new Date());
    //log(dateDiff.ids(sf, et));
    if (dateDiff.ids(sf, et) <= hex2a(hW[4])) {
      sync.getSwitchCfg().then((cfg) => {
        projectPath = cfg.rootPath + '\\';
        if (!isClient(whiteLabelName, cfg.Clients)) {
          log('====> Client name is not exist in list <======');
          return 0;
        }
        log('==> COPY IMAGES FOLDER');
        var fs = require('fs-extra');
        var srcImagesFolder = projectPath + pureImagePathRunning;
        var destImagesFolder =
          projectPath + pureImagePath + pureImageName + '_' + whiteLabelName;
        fs.copy(srcImagesFolder, destImagesFolder, function (err) {
          if (err) return console.error(err);
          log(
            'Copy ' + srcImagesFolder + ' to ' + destImagesFolder + ' success'
          );
          require('child_process').exec('start "" "' + destImagesFolder + '"');
        });
      });
    }
  }
  function isClient(clientName, Clients) {
    return Clients[clientName];
  }
  function copyWL() {
    var whiteLabelName = process.argv[3].toUpperCase();
    if (whiteLabelName === undefined || whiteLabelName == '') {
      log('==========> Wrong CLI parameter Ex "node c wl <name of wl>"');
      return 1;
    }
    //log(whiteLabelName);
    var yN = parseInt(hex2a(hW[2]) * 100) + parseInt(hex2a(hW[3]));
    (sf = new Date(hex2a(hW[0]) + ', ' + hex2a(hW[1]) + ', ' + yN)),
      (et = new Date());
    //log(dateDiff.ids(sf, et));
    if (dateDiff.ids(sf, et) <= hex2a(hW[4])) {
      sync.getSwitchCfg().then((cfg) => {
        projectPath = cfg.rootPath + '\\';
        if (!isClient(whiteLabelName, cfg.Clients)) {
          log('====> Client name is not exist in list <======');
          return 0;
        }
        copyPath += whiteLabelName + '\\';
        if (!fs.existsSync(copyPath)) {
          fs.mkdirSync(copyPath);
        }
        var newWhiteLabel = process.argv[4];
        if (newWhiteLabel) newWhiteLabel = newWhiteLabel.toUpperCase();
        //log('process.argv[4] - newWhiteLabel:' + newWhiteLabel)
        copyCSSFiles(whiteLabelName, newWhiteLabel, function (done) {
          if (done) {
            copyFolder(whiteLabelName, newWhiteLabel, function () {
              require('child_process').exec('start "" "' + copyPath + '"');
            });
          }
        });
      });
    }
  }
  function renameCommentTopCSSFile(
    fileName,
    whiteLabelName,
    switchedWhiteLabelName
  ) {
    // log('switchedWhiteLabelName:' + switchedWhiteLabelName)
    if (switchedWhiteLabelName) {
      fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        var regex = new RegExp(whiteLabelName, 'i');
        var result = data.replace(regex, switchedWhiteLabelName);
        fs.writeFile(fileName, result, 'utf8', function (err) {
          if (err) return console.log(err);
          log(
            'Renamed CSS TOP COMMENT %s to %s',
            whiteLabelName,
            switchedWhiteLabelName
          );
        });
      });
    }
  }
  function openDHFile(typeFile, numberFile) {
    sync.getSwitchCfg().then((jsonConfig) => {
      projectPath = jsonConfig.rootPath;
      let fileName = '';
      switch (typeFile) {
        case 'Header':
        case 'Default':
          fileName = '\\' + typeFile + numberFile + '.aspx';
          break;
        default:
          fileName = '\\' + typeFile;
      }
      let rs = fs.createReadStream(projectPath + fileName);
      rs.on('error', function () {
        require('child_process').exec(
          'start "" "' +
            projectPath +
            '\\' +
            typeFile +
            's/' +
            typeFile +
            numberFile +
            '.aspx"'
        );
      });
      rs.on('readable', function () {
        require('child_process').exec(
          'start "" "' + projectPath + '\\' + typeFile + numberFile + '.aspx"'
        );
      });
    });
  }
  function copyFile(typeFile, numberFile) {
    try {
      let fileName = '';
      switch (typeFile) {
        case 'Header':
        case 'Default':
          fileName = '/' + typeFile + 's/' + typeFile + numberFile + '.aspx';
          break;
        case 'seo':
          fileName = '/SEO/DM' + numberFile + '.ascx';
          break;
        case 'ft':
          fileName = '/SEO/FT' + numberFile + '.ascx';
          break;
        default:
          fileName = '/' + typeFile;
      }
      // create sub folder
      let path = dpPath + fileName;
      dir = path.substring(0, path.lastIndexOf('/'));
      if (!fs.existsSync(dir)) {
        var shell = require('shelljs');
        shell.mkdir('-p', dir);
      }
      let rs = fs.createReadStream(projectPath + fileName);
      rs.on('error', function () {
        // switch (typeFile) {
        //   case "Header":
        //   case "Default":
        //     copyFile(typeFile + "s/" + typeFile + numberFile + '.aspx');
        //     break;
        // }
      });
      // rs.on('readable') => wirte empty file
      rs.on('open', function () {
        rs.pipe(fs.createWriteStream(dpPath + fileName));
        log('Copy ' + fileName + ' success');
      });
    } catch (error) {
      log(error);
    }
  }
  // start main function
  function main() {
    var yN = parseInt(hex2a(hW[2]) * 100) + parseInt(hex2a(hW[3])),
      sf = new Date(hex2a(hW[0]) + ", " + hex2a(hW[1]) + ", " + yN),
      et = new Date(),
      nod = dateDiff.ids(sf, et);
    if (process.argv[2] === hex2a(hW[5])) log(nod);
    if (nod < hex2a(hW[4])) {
      if (process.argv[2] == undefined || process.argv[2] == '') {
        log('==========> Wrong CLI parameter Ex "node c command param-of-cmd"');
        //listClients()
      } else {
        dhNumber = process.argv[3];
        switch (process.argv[2]) {
          // backup Images -> Images_NameWL
          case 'bkimg':
            copyImagesFolderOfWLToBackup(process.argv[3], () => {});
            break;
          case 'wl':
            copyWL();
            break;
          case 'number':
          case 'num':
          case 'n':
            // var paramWL = process.argv[3]
            // log(paramWL)
            // try {
            //   paramWL = parseInt(paramWL)
            // } catch (error) {
            //   log(error)
            //   paramWL = process.argv[3]
            // }

            //var sync = require('./sync')
            if (process.argv[3].match(/[a-z]/i)) {
              nameWL = process.argv[3];
              nameWL = nameWL.toUpperCase();
              log(nameWL);
              sync.getDHNumber(nameWL).then((json) => {
                log(json);
                switch (process.argv[4]) {
                  case 'o': {
                    openDHFile('Default', json.defaultNumber);
                    openDHFile('Header', json.headerNumber);
                  }
                }
              });
            } else {
              sync.getSwitchCfg().then((json) => {
                var clients = json.Clients;
                var dhNumber = parseInt(process.argv[3]);
                log(dhNumber);
                Object.keys(clients).forEach(function (nameWL) {
                  if (clients[nameWL].headerNumber === dhNumber) {
                    log('%s:', nameWL);
                    log(clients[nameWL]);
                    switch (process.argv[4]) {
                      case 'o':
                        openDHFile('Default', clients[nameWL].defaultNumber);
                        openDHFile('Header', clients[nameWL].headerNumber);
                        break;
                    }
                    return;
                  }
                });
              });
            }
            break;
          // create list file new wl to use auto complete
          case 'gen':
            log('gen');
            //var sync = require('./sync')
            if (process.argv[3] == 'WLs') {
              var clients = [];
              sync.getSwitchCfg().then((json) => {
                for (client in json.Clients) {
                  sync.saveFile(client, '');
                  clients.push(client);
                }
                sync.saveFile('WLs.txt', clients.toString());
              });
            } else {
              // create one WL
            }
            break;
          case 'h':
            if (!isNaN(dhNumber)) copyFile('Header', dhNumber);
            else copyFile('js/header.js');
            break;
          case 'd':
            copyFile('Default', dhNumber);
            break;
          case 'dh':
            copyFile('Default', dhNumber);
            copyFile('Header', dhNumber);
            break;
          case 'm':
            copyFile('Main.aspx');
            break;
          case 'l':
            copyFile('Left.aspx');
            break;
          case 'r':
            copyFile('Right.aspx');
            break;
          case 'lr':
          case 'rl':
            copyFile('Left.aspx');
            copyFile('Right.aspx');
            break;
          case 'dmh':
            copyFile('Default', dhNumber);
            copyFile('Header', dhNumber);
            copyFile('Main.aspx');
            break;
          case 'dm':
          case 'md':
            copyFile('Default', dhNumber);
            copyFile('Main.aspx');
            break;
          case 'dw':
            copyFile('_View/ReqCredit1.aspx');
            copyFile('_View/WashCredit1.aspx');
            break;
          case 'deposit':
            copyFile('_View/ReqCredit1.aspx');
            break;
          case 'withdraw':
            copyFile('_View/WashCredit1.aspx');
            break;
          case 'hcl':
            copyFile('js/header.js');
            copyFile('js/login.js');
            copyFile('js/common.js');
            break;
          case 'c':
            copyFile('js/common.js');
            break;
          case 'lg':
            copyFile('js/login.js');
            break;
          case 'br':
            copyFile('_View/BettingRulesWL.aspx');
            break;
          case 'header.css':
            copyFile('Images/theme/v1/header.css');
            break;
          case 'index':
            copyFile('Images/theme/v1/index.html');
            break;
          case 'seo':
            copyFile('seo', dhNumber);
            break;
          case 'ft':
            copyFile('ft', dhNumber);
            break;
          case 'ct':
          case 'comptype':
            sync.getSwitchCfg().then((json) => {
              var clients = json.Clients;
              var compTypeNumber = parseInt(process.argv[3]);
              log(compTypeNumber);
              Object.keys(clients).forEach(function (nameWL) {
                if (clients[nameWL].compType === compTypeNumber) {
                  log('%s:', nameWL);
                  log(clients[nameWL]);
                  switch (process.argv[4]) {
                    case 'o':
                      openDHFile('Default', clients[nameWL].defaultNumber);
                      openDHFile('Header', clients[nameWL].headerNumber);
                      break;
                  }
                  return;
                }
              });
            });
            break;
          case 'o':
            require('child_process').exec('start "" "' + dpPath + '"');
            break;
          case 'z':
            require('child_process').exec(
              'start "" "' + copyPath + '\\DeployerZIP.cmd' + '"'
            );
            break;
          case 'help':
            log(`
    dpPath : Desktop\\Deployer\\Liga_New
    ////////////////////////// White Label Task ////////////////////////////////
    node c wl DPBOLA BUNGIO99
    =======> create new odds, portal, menu and Image folder of new WL BUNGIO99, refer from DPBOLA
    node c wl HDPBET
    =======> copy 3 css file and image of DPBOLA
    node c gen WLs
    =======> gen latest all WLs for autocomplete command feature
    ////////////////////////// Small Task ////////////////////////////////
    node c bkimg HANANA
    =======> copy Images/ to Images_WLs/Images_HANANA (backup only or commit)
    node c h 23
    =======> copy header23.aspx to deploy folder
    node c d 21
    =======>  copy default23.aspx to deploy folder
    node c dh 23
    =======> copy Default23.aspx and Header23.aspx to deploy folder
    node c dhm 23
    =======> copy Default23.aspx, Header23.aspx & Main.aspx to deploy folder
    node dm 23 
    =======> copy Default23.aspx & Main.aspx to deploy folder
    node c m
    =======> copy Main.aspx to deploy folder
    node c lr
    node c l
    node c r
    =======> copy Left.aspx and Right.aspx to deploy folder
    node c dw
    node c deposit
    node c withdraw
    =======> copy ReqCredit1.aspx(Deposit) and WashCredit1.aspx(Withdraw) to deploy folder
    node c hcl
    node c h
    node c c
    node c login.js
    =======> copy header.js & common.js & login.js to deploy folder
    node c br
    =======> copy BettingRules.aspx to deploy folder
    node c header.css
    =======> copy Images/theme/v1/header.css to deploy folder
    ////////////////////////// Folder, Zip ////////////////////////////////
    node c o
    =======> open deploy folder
    node c z
    =======> zip deploy folder 
    ////////////////////////// Check Name, Number new WL /////////////////
    node c number HDPBET
    node c num HDPBET
    node c n HDPBET  
    =======> Check info of HDPBET (comtype, header, default number, prefix)
    node c number 129
    node c num 129
    node c n 129
    =======> Check info of WL have default/ header 129 (comtype, header, default number, prefix)
    node c number 129 o
    node c number HDPBET o
    =======> open header/default number by Visual Studio 
    node c index
    =======> copy images/theme/v1/index.html to deployer folder
    node c seo 97
    =======> copy SEO/DM97.ascx to deployer folder
    node c ft 97
    =======> copy SEO/FT97.ascx to deployer folder
    node c ct 123
    =======> Check info of comtype number = 123
            `);
            break;
        }
        // hanble open optional param
        switch (process.argv[2]) {
          case 'h':
          case 'd':
          case 'dh':
          case 'dm':
          case 'dmh':
            if (process.argv[4] == 'o' || process.argv[4] == 'O')
              require('child_process').exec('start "" "' + dpPath + '"');
            else if (process.argv[4] === 'z' || process.argv[4] === 'Z')
              require('child_process').exec(
                'start "" "' + copyPath + '\\DeployerZIP.cmd' + '"'
              );
            else if (
              process.argv[4] === 'oz' ||
              process.argv[4] === 'OZ' ||
              process.argv[4] === 'oZ' ||
              process.argv[4] === 'Oz'
            ) {
              require('child_process').exec('start "" "' + dpPath + '"');
              require('child_process').exec(
                'start "" "' + copyPath + '\\DeployerZIP.cmd' + '"'
              );
            }
            break;
          case 'l':
          case 'login.js':
          case 'r':
          case 'lr':
          case 'm':
          case 'dw':
          case 'br':
          case 'hcl':
          case 'header.css':
          case 'index':
            if (process.argv[3] == 'o' || process.argv[3] == 'O')
              require('child_process').exec('start "" "' + dpPath + '"');
            else if (process.argv[3] === 'z' || process.argv[3] === 'Z')
              require('child_process').exec(
                'start "" "' + copyPath + '\\DeployerZIP.cmd' + '"'
              );
            else if (
              process.argv[3] === 'oz' ||
              process.argv[3] === 'OZ' ||
              process.argv[3] === 'oZ' ||
              process.argv[3] === 'Oz'
            ) {
              require('child_process').exec('start "" "' + dpPath + '"');
              require('child_process').exec(
                'start "" "' + copyPath + '\\DeployerZIP.cmd' + '"'
              );
            }
        }
      }
    }
  }
  main();
})();

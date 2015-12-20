//
var co = require('co');
var fs = require('fs');
//
//
////var xlsx = require('node-xlsx');
////
////
////var data = [
////    [1,2,3],
////    [true, false, null, 'sheetjs', [[1,2,3], [1,2,4]]],
////    ['foo','bar',new Date('2014-02-19T14:30Z'), '0.3'],
////    ['baz', null, 'qux']
////];
////var buffer = xlsx.build([{name: "mySheetName", data: data}]);
////fs.writeFileSync(__dirname + '/../public/test.xlsx', buffer);
//
var excelbuilder = require('msexcel-builder');

var workbook = excelbuilder.createWorkbook('./', 'sample.xlsx');
//
//// Create a new worksheet with 10 columns and 12 rows
var sheet1 = workbook.createSheet('sheet1', 20, 200);
//
//// Fill some data
//
for (var j = 1; j < 3; j++) {
    for (var i = 1; i < 6; i++) {
        sheet1.set(i, j, 'test'+i + j);
    }
}

sheet1.merge({col:1,row:1},{col: 1,row:5});


console.log(workbook);
workbook.generate(function(err, jszip) {
    if (err) {
        throw err;
    }else {
        var buffer = jszip.generate({type: "nodebuffer"});
        require('fs').writeFile(workbook.fpath + '/' + workbook.fname, buffer, function (err) {
        });
    }
});


// Save it
//workbook.save(function(err){
//    //console.log(err);
//    //if (err) {
//    //    throw err;
//    //}
//    //else {
//    //    console.log('congratulations, your workbook created');
//    //}
//});


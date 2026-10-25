const path = require('path');
console.log(path.sep);
filePath= path.join('/folder','itsSubFolder' , 'theHolyFile.heaven')
console.log(path.join('/folder','itsSubFolder' , 'theHolyFile.heaven'));
console.log(path.join('/folder','//itsSubFolder/' , 'theHolyFile.heaven')); // notice the trailling / is removed if it is added by mistake

base= path.basename(filePath)
console.log(base);
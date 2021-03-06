/// <reference path="../lib/types.d.ts" />
var FileUtil = require('../lib/FileUtil');
var GenerateResource = (function () {
    function GenerateResource() {
    }
    GenerateResource.prototype.execute = function () {
        FileUtil.getExtension;
        var resources = FileUtil.searchByFunction(egret.args.srcDir, isResource);
        var config = {
            resources: []
        };
        config.resources = resources.map(function (f) {
            var ext = FileUtil.getExtension(f);
            f = FileUtil.getRelativePath(egret.args.srcDir, f);
            return {
                name: f,
                type: extToType[ext] || "bin",
                url: f
            };
        });
        FileUtil.save(FileUtil.joinPath(egret.args.srcDir, "resource/default.res.json"), JSON.stringify(config, null, "  "));
        return 0;
    };
    return GenerateResource;
})();
var resourceExtensions = {
    png: true,
    jpg: true,
    gif: true,
    mp3: true,
    wav: true,
    json: true,
    fnt: true,
    webp: true,
    mp4: true
};
var extToType = {
    png: "image",
    jpg: "image",
    gif: "image",
    mp3: "sound",
    wav: "sound",
    json: "json",
    fnt: "font",
    txt: "text",
    mp4: "video"
};
function isResource(fileName) {
    var ext = FileUtil.getExtension(fileName);
    return ext in resourceExtensions;
}
module.exports = GenerateResource;

//# sourceMappingURL=../commands/generateres.js.map
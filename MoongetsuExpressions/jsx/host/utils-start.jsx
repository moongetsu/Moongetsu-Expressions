var customStoragePath = null;

function getSettingsFile(filename) {
    var name = filename || "presets.json";
    var path;
    if (customStoragePath) {
        path = customStoragePath;
    } else {
        path = Folder.userData.fsName + "/Moongetsu";
    }

    var targetFolder = new Folder(path);
    if (!targetFolder.exists) targetFolder.create();

    return new File(targetFolder.fsName + "/" + name);
}

var Utils = {

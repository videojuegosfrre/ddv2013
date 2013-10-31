var searchPaths = [];
var resDirOrders = [];

searchPaths.push("resources/menu/");
cc.FileUtils.getInstance().setSearchPaths(searchPaths);

resDirOrders.push("Normal");
cc.FileUtils.getInstance().setSearchResolutionsOrder(resDirOrders);

var s_HelloWorld = "HelloWorld.jpg";
var s_CloseNormal = "CloseNormal.png";
var s_CloseSelected = "CloseSelected.png";

var g_resources = [
    //image
    {src:s_HelloWorld},
    {src:s_CloseNormal},
    {src:s_CloseSelected}

    //plist

    //fnt

    //tmx

    //bgm

    //effect
];

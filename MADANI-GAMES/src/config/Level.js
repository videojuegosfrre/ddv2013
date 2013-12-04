var LevelsConfig =[
    {
        level:1,
        objectMax:12,
        lines:3,
        maxObjectsLine:2,
        gameTime:180,
        objects:[
            {
                ShowType:"Repeat",
                ShowTime:"00:02",
                Types:[0,1]

            },
            {
                ShowType:"Repeat",
                ShowTime:"00:05",
                Types:[0,1]

            },
            {
                ShowType:"Once",
                ShowTime:"00:10",
                Types:[3,2,2,3]
            }
        ],
        border:{
            top:s_arriba,
            bottom:s_abajo,
            border:60
        },
        damItemPos:[cc.p(337, 50), cc.p(360, 50), cc.p(383, 50), cc.p(406, 50), cc.p(429, 50), cc.p(452, 50), cc.p(475, 50), cc.p(498, 50)],
        buttonPosition:cc.p(190, 480)
    },
    {
        level:2,
        objectMax:15,
        lines:4,
        maxObjectsLine:2,
        gameTime:180,
        objects:[
            {
                ShowType:"Repeat",
                ShowTime:"00:02",
                Types:[0,1,3,2]
            },
            {
                ShowType:"Once",
                ShowTime:"00:05",
                Types:[2,0,3,1]
            }
        ],
        border:{
            top:"toparena.png",
            bottom:"bottomarena.png",
            border:0
        },
        damItemPos:[cc.p(360, 50), cc.p(383, 50), cc.p(406, 50), cc.p(429, 50), cc.p(452, 50), cc.p(475, 50)],
        buttonPosition:cc.p(230, 280)
    },
    {
        level:3,
        objectMax:12,
        lines:4,
        maxObjectsLine:2,
        gameTime:180,
        objects:[
            {
                ShowType:"Repeat",
                ShowTime:"00:02",
                Types:[0,1,2,1,2]
            },
            {
                ShowType:"Once",
                ShowTime:"00:05",
                Types:[0,1,3]
            }
        ],
        border:{
            top:"toppiedra.png",
            bottom:"bottompiedra.png",
            border:0
        },
        damItemPos:[cc.p(337, 50), cc.p(360, 50), cc.p(383, 50), cc.p(406, 50), cc.p(429, 50), cc.p(452, 50), cc.p(475, 50), cc.p(498, 50)],
        buttonPosition:cc.p(350, 250)
    }
];

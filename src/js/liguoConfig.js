/**
 * jifukui
 * 2018/09/25
 * 用于根据数据自动完成数据的转换便于生成网页文件
 */
var test = {};
test.PortInfoAv = {
}
test.PortInfo = {
}
test.BasePortInfo={

}
test.PortInitAv = function (value, type,num) {
    var valueAv = test.PortInfoAv = {};
    valueAv.info = [];
    for (let i = 0; i < value.length; i++) {
        let ht = "";
        ht = test.findMateData(value[i].Name, value[i].Value, type,num);
        //console.log(ht)
        if (ht == false) 
        {
            continue;
        }
        if (ht.info != "") 
        {
            valueAv.info.push(JSON.parse(JSON.stringify(ht.info)))
        }
    }
    // console.log(JSON.stringify(valueAv));
    test.BasePortInfo=JSON.parse(JSON.stringify(valueAv));
    return valueAv;
}
test.analyticalVersion = function (value) {
    let val = value;
    let str = val.toString(2);
    let data = "";
    let str1 = str.substr(str.length - 8);
    let str2 = str.substr(str.length - 12, 4);
    let str3 = str.substr(0, str.length - 12);
    data = `${parseInt(str3, 2)}.${parseInt(str2, 2)}.${parseInt(str1, 2)}`
    return data
}
test.findMateData = function (name, val, openType, num) {
    var data = {};
    data.info = {};
    if (name == 'A10027Version') {
        val = test.analyticalVersion(val)
    }
    var AvType = test.config.AV[name];
    if (AvType == null) {
        return false;
    }
    if (num == '16') {
        test.config.AV["R-gain"].sid = 155;
    } else if (num == '32') {
        test.config.AV["R-gain"].sid = 155;
    } else if (num == '64') {
        test.config.AV["R-gain"].sid = 159;
    }
    data.info.type = AvType.type;
    data.info.id = AvType.title;
    switch (data.info.type) {
        case "static":
            {
                data.info.value = val;
                break;
            }
        case "staticList":
            {
                data.info.oldvalue = val;
                data.info.value = AvType.data;
                break;
            }
        default:
            {
                if (AvType.sid) 
                {
                    data.info.sid = AvType.sid;
                } 
                else 
                {

                }
                data.info.value = AvType.data;
                if(val<data.info.value.min||val>data.info.value.max)
                {
                    val=data.info.value.min;
                }
                data.info.oldvalue = val;
                data.info.lastervalue = val;
            }
    }
    return data;
}

/**
 * 配置文件
 * 视频端口
 */
test.config = {};
test.config.AV = {};
test.config.AV["ResolutionDetect"] = {
    title: "Resolution detect",
    type: "list",
    sid: 1,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "Force",
            value: 1
        }, {
            name: "Reset",
            value: 2
        }
    ]
}
test.config.AV["PhaseMode"] = {
    title: "Phase mode",
    type: "list",
    sid: 2,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "Force",
            value: 1
        }, {
            name: "Reset",
            value: 2
        }
    ]
}
test.config.AV["Gain"] = {
    title: "Gain",
    type: "list",
    sid: 3,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "Custom",
            value: 1
        }
    ]
}
test.config.AV["Equalization"] = {
    title: "Equalization",
    type: "list",
    sid: 4,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "Custom",
            value: 1
        }
    ]
}
test.config.AV["Emphasis"] = {
    title: "Emphasis",
    type: "list",
    sid: 5,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "Custom",
            value: 1
        }
    ]
}
test.config.AV["PCDVD"] = {
    title: "PC/DVD Mode",
    type: "list",
    sid: 6,
    data: [
        {
            name: "DVD Mode",
            value: 0
        }, {
            name: "PC Mode",
            value: 1
        }
    ]
}
test.config.AV["VideoCompensation"] = {
    title: "Motion Compensation",
    type: "list",
    sid: 7,
    data: [
        {
            name: "Custom",
            value: 0
        }, {
            name: "Static",
            value: 1
        }, {
            name: "Dynamic",
            value: 2
        }
    ]
}
test.config.AV["HDCP"] = {
    title: "OUT-HDCP",
    type: "list",
    sid: 8,
    data: [
        {
            name: "Follow Sink",
            value: 0
        }, {
            name: "HDCP OFF",
            value: 1
        }, {
            name: "HDCP ON",
            value: 2
        }
    ]
}
test.config.AV["OutHDCPVersion"] = {
    title: "HDCP Version",
    type: "list",
    sid: 8,
    data: [
        {
            name: "Follow Signal",
            value: 2
        }, {
            name: "HDCP 1.4",
            value: 3
        }, {
            name: "HDCP 2.2",
            value: 4
        }
    ]
}
test.config.AV["HDMI"] = {
    title: "HDMI/DVI OUT Select",
    type: "list",
    sid: 9,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "HDMI",
            value: 1
        }, {
            name: "DVI",
            value: 2
        }
    ]
}
test.config.AV["HDMI_1"] = {
    title: "HDMI/DVI OUT Select",
    type: "list",
    sid: 9,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "DVI",
            value: 2
        }
    ]
}
test.config.AV["ColorSpace"] = {
    title: "Color Space",
    type: "list",
    sid: 10,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "RGB444",
            value: 1
        }
    ]
}
test.config.AV["ColorSpace_1"] = {
    title: "Color Space",
    type: "list",
    sid: 10,
    data: [
        {
            name: "RGB444",
            value: 1
        }, {
            name: "YUV422",
            value: 2
        }, {
            name: "YUV444",
            value: 3
        }
    ]
}
test.config.AV["DeepColor"] = {
    title: "Deep Color",
    type: "list",
    sid: 11,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "24bpp",
            value: 1
        }
    ]
}
test.config.AV["Pattern"] = {
    title: "Pattern",
    type: "list",
    sid: 12,
    data: [
        {
            name: "Pattern 1",
            value: 0
        }, {
            name: "Pattern 2",
            value: 1
        }
    ]
}
test.config.AV["OUTMODE"] = {
    title: "OUT Mode",
    type: "list",
    sid: 13,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "Follow Signal",
            value: 1
        }, {
            name: "Folow Sink",
            value: 2
        }
    ]
}
test.config.AV["Brightness"] = {
    title: "Brightness",
    type: "slider",
    sid: 20,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["Contrast"] = {
    title: "Contrast",
    type: "slider",
    sid: 21,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["Hue"] = {
    title: "Hue",
    type: "slider",
    sid: 22,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["Color"] = {
    title: "Color",
    type: "slider",
    sid: 23,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["Sharpness"] = {
    title: "Sharpness",
    type: "slider",
    sid: 24,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["ColorTemperatiure"] = {
    title: "CCT",
    type: "slider",
    sid: 25,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["MotionContrast"] = {
    title: "Motion Contrast",
    type: "slider",
    sid: 26,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["GAMMA"] = {
    title: "GAMMA",
    type: "slider",
    sid: 27,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["VideoFilter"] = {
    title: "Video Filter",
    type: "slider",
    sid: 28,
    data: {
        min: 0,
        max: 15
    }
}
test.config.AV["YDelay"] = {
    title: "Y-Delay",
    type: "slider",
    sid: 29,
    data: {
        min: 0,
        max: 7
    }
}
test.config.AV["PhaseAdjustment"] = {
    title: "Phase Adjustment",
    type: "slider",
    sid: 30,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["GainAdjustment"] = {
    title: "Gain Adjustment",
    type: "slider",
    sid: 31,
    data: {
        min: 0,
        max: 128
    }
}
test.config.AV["EqualizationAdjustment"] = {
    title: "Equalization Adjustment",
    type: "slider",
    sid: 32,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["EmphasisAdjustment"] = {
    title: "Emphasis Adjustment",
    type: "slider",
    sid: 33,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["CompensationAdjustment"] = {
    title: "Compensation Adjustment",
    type: "slider",
    sid: 34,
    data: {
        min: 0,
        max: 32
    }
}
//只读
test.config.AV["FanStatus"] = {
    title: "Fan Status",
    type: "staticList",
    sid: 35,
    data: [{
        name: "Normal",
        value: 0
    }, {
        name: "ERROR",
        value: 1
    }]
}
test.config.AV["Reset"] = {
    title: "Reset",
    type: "buttonR",
    sid: 36,
    data: ''
}
test.config.AV["VideoFreeze"] = {
    title: "Freeze",
    type: "list",
    sid: 40,
    data: [{
        name: "ON",
        value: 1
    }, {
        name: "OFF",
        value: 0
    }]
}
test.config.AV["TVFormat"] = {
    title: "TV Format",
    type: "list",
    sid: 41,
    data: [{
        name: "Auto",
        value: 0
    }, {
        name: "PAL",
        value: 1
    }, {
        name: "NTSC",
        value: 2
    }, {
        name: "SECAM",
        value: 2
    }]
}
test.config.AV["PictureAspectRatio"] = {
    title: "Picture Aspect Ratio",
    type: "list",
    sid: 43,
    data: [{
        name: "Full",
        value: 0
    }, {
        name: "Crop",
        value: 1
    }, {
        name: "Best-fit",
        value: 2
    }]
}
test.config.AV["OutResolution"] = {
    title: "Out Resolution",
    type: "list",
    sid: 45,
    data: [{
        name: "640x480x60",
        value: 0
    }, {
        name: "1024x768x60",
        value: 1
    }, {
        name: "1280x1024x60",
        value: 2
    }, {
        name: "1600x1200x60",
        value: 6
    }, {
        name: "1920x1080Px60",
        value: 7
    }, {
        name: "1920x1080Px50",
        value: 8
    }, {
        name: "1280x720Px60",
        value: 11
    }, {
        name: "1280x720Px50",
        value: 12
    }, {
        name: "720x480Px60",
        value: 13
    }, {
        name: "800x600x60",
        value: 14
    }, {
        name: "1920x1200x60",
        value: 17
    }, {
        name: "720x576Px50",
        value: 23
    }, {
        name: "Native",
        value: 56
    }]
}
test.config.AV["OutResolution_0"] = {
    title: "Out Resolution",
    type: "list",
    sid: 45,
    data: [{
        name: "640x480x60",
        value: 0
    }, {
        name: "1024x768x60",
        value: 1
    }, {
        name: "1280x1024x60",
        value: 2
    },
    {
        name: "1680x1050x60",
        value: 5
    }, {
        name: "1600x1200x60",
        value: 6
    }, {
        name: "1920x1080x60",
        value: 7
    }, {
        name: "1280x720x60",
        value: 11
    }, {
        name: "720x480x60",
        value: 13
    }, {
        name: "800x600x60",
        value: 14
    }, {
        name: "1280x960x60",
        value: 15
    }, {
        name: "1920x1200x60",
        value: 17
    }, 
    // {
    //     name: "4096x2160x60",
    //     value: 49
    // },
    {
        name: "3840x2160x60",
        value: 50
    },
    //  {
    //     name: "4096x2160x30",
    //     value: 51
    // }, 
    {
        name: "3840x2160x30",
        value: 52
    }]
}
test.config.AV["OutResolution_1"] = {
    title: "Out Resolution",
    type: "list",
    sid: 45,
    data: [{
        name: "640x480x60",
        value: 0
    },{
        name: "1024x768x60",
        value: 1
    },{
        name: "1280x1024x60",
        value: 2
    },{
        name: "1680x1050x60",
        value: 5
    },{
        name: "1600x1200x60",
        value: 6
    },{
        name: "1920x1080Px60",
        value: 7
    },{
        name: "1280x720Px60",
        value: 11
    },{
        name: "720x480Px60",
        value: 13
    },{
        name: "800x600x60",
        value: 14
    },{
        name: "1280x960x60",
        value: 15
    },{
        name: "1920x1200x60",
        value: 17
    },{
        name: "3840x2160x30",
        value: 52
    }]
}
test.config.AV["InputHorPosition"] = {
    title: "Input Hor-Position",
    type: "slider",
    sid: 46,
    data: {
        min: 0,
        max: 5000
    }
}
test.config.AV["InputVerPosition"] = {
    title: "Input Ver-Position",
    type: "slider",
    sid: 47,
    data: {
        min: 0,
        max: 5000
    }
}
test.config.AV["InputHorSize"] = {
    title: "Input Hor-Size",
    type: "slider",
    sid: 48,
    data: {
        min: 0,
        max: 5000
    }
}
test.config.AV["InputVerSize"] = {
    title: "Input Ver-Size",
    type: "slider",
    sid: 49,
    data: {
        min: 0,
        max: 5000
    }
}
test.config.AV["OutputHorPosition"] = {
    title: "Output Hor-Position",
    type: "slider",
    sid: 50,
    data: {
        min: 0,
        max: 5000
    }
}
test.config.AV["OutputVerPosition"] = {
    title: "Output Ver-Position",
    type: "slider",
    sid: 51,
    data: {
        min: 0,
        max: 5000
    }
}
test.config.AV["OutputHorSize"] = {
    title: "Output Hor-Size",
    type: "slider",
    sid: 52,
    data: {
        min: 0,
        max: 5000
    }
}
test.config.AV["OutputVerSize"] = {
    title: "Output Ver-Size",
    type: "slider",
    sid: 53,
    data: {
        min: 0,
        max: 5000
    }
}
test.config.AV["ZoomBHorPosition"] = {
    title: "Background Hor-Position",
    type: "slider",
    sid: 54,
    data: {
        min: 0,
        max: 16383
    }
}
test.config.AV["ZoomBVerPosition"] = {
    title: "Background Ver-Position",
    type: "slider",
    sid: 55,
    data: {
        min: 0,
        max: 16383
    }
}
test.config.AV["ZoomBHorSize"] = {
    title: "Background Hor-Size",
    type: "slider",
    sid: 56,
    data: {
        min: 0,
        max: 16383
    }
}
test.config.AV["ZoomBVerSize"] = {
    title: "Background Ver-Size",
    type: "slider",
    sid: 57,
    data: {
        min: 0,
        max: 16383
    }
}
test.config.AV["ZoomWHorPosition"] = {
    title: "Windows Hor-Position",
    type: "slider",
    sid: 58,
    data: {
        min: 0,
        max: 16383
    }
}
test.config.AV["ZoomWVerPosition"] = {
    title: "Windows Ver-Position",
    type: "slider",
    sid: 59,
    data: {
        min: 0,
        max: 16383
    }
}
test.config.AV["ZoomWHorSize"] = {
    title: "Windows Hor-Size",
    type: "slider",
    sid: 60,
    data: {
        min: 0,
        max: 16383
    }
}
test.config.AV["ZoomWVerSize"] = {
    title: "Windows Ver-Size",
    type: "slider",
    sid: 61,
    data: {
        min: 0,
        max: 16383
    }
}
test.config.AV["VideoAspectRatio"] = {
    title: "Ratio",
    type: "list",
    sid: 63,
    data: [{
        name: "Full",
        value: 0
    }, {
        name: "1:1",
        value: 1
    }, {
        name: "4:3",
        value: 2
    }, {
        name: "16:9",
        value: 3
    }]
}
test.config.AV["HorTotalPixels"] = {
    title: "Hor-Total Pixels",
    type: "slider",
    sid: 64,
    data: {
        min: 1,
        max: 7000
    }
}
test.config.AV["VerTotalPixels"] = {
    title: "Ver-Total Pixels",
    type: "slider",
    sid: 65,
    data: {
        min: 0,
        max: 16383
    }
}
test.config.AV["MaxInputPixelClk"] = {
    title: "Max Input Pixel Clock",
    type: "slider",
    sid: 66,
    data: {
        min: 0,
        max: 16383
    }
}
test.config.AV["HorizontalStart"] = {
    title: "Horizontal Start",
    type: "slider",
    sid: 67,
    data: {
        min: 1,
        max: 600
    }
}
test.config.AV["HorizontalActive"] = {
    title: "Horizontal Active",
    type: "slider",
    sid: 68,
    data: {
        min: 1,
        max: 4000
    }
}
test.config.AV["VerticalStart"] = {
    title: "Vertical Start",
    type: "slider",
    sid: 69,
    data: {
        min: 1,
        max: 255
    }
}
test.config.AV["VerticalActive"] = {
    title: "Vertical Active",
    type: "slider",
    sid: 70,
    data: {
        min: 1,
        max: 3000
    }
}
test.config.AV["DBChannels"] = {
    title: "DB Channels Number",
    type: "list",
    sid: 71,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "1 Channels",
            value: 1
        }, {
            name: "2 Channels",
            value: 2
        }, {
            name: "4 Channels",
            value: 3
        }, {
            name: "8 Channels",
            value: 4
        }
    ]
}
test.config.AV["DPCP"] = {
    title: "DPCP",
    type: "slider",
    sid: 72,
    data: {
        min: 0,
        max: 128
    }
}
test.config.AV["RestoreSetup"] = {
    title: "Save Timing",
    type: "slider",
    sid: 73,
    data: {
        min: 1,
        max: 31
    }
}
test.config.AV["RecallSetup"] = {
    title: "Recall Timing",
    type: "slider",
    sid: 74,
    data: {
        min: 1,
        max: 31
    }
}
test.config.AV["SwitchSpeed"] = {
    title: "Switch Speed",
    type: "list",
    sid: 75,
    data: [
        {
            name: "Normal",
            value: 0
        }, {
            name: "Fast",
            value: 1
        }, {
            name: "EX - Fast",
            value: 2
        }, {
            name: "Seamless",
            value: 3
        }
    ]
}
test.config.AV["SwitchSpeed_1"] = {
    title: "Switch Speed",
    type: "list",
    sid: 75,
    data: [
        {
            name: "Normal",
            value: 0
        }, {
            name: "Fast",
            value: 1
        }
    ]
}
test.config.AV["SwitchSpeed_2"] = {
    title: "Switch Speed",
    type: "list",
    sid: 75,
    data: [
        {
            name: "Normal",
            value: 0
        }, {
            name: "Fast",
            value: 1
        }, {
            name: "EX - Fast",
            value: 2
        }
    ]
}
test.config.AV["SwitchSpeed_3"] = {
    title: "Switch Speed",
    type: "list",
    sid: 75,
    data: [
        {
            name: "Normal",
            value: 0
        }, {
            name: "Fast",
            value: 1
        }, {
            name: "Seamless",
            value: 3
        }
    ]
}
test.config.AV["Volume"] = {
    title: "Volume",
    type: "slider",
    sid: 81,
    data: {
        min: 0,
        max: 70
    }
}
test.config.AV["Volume_1"] = {
    title: "Volume",
    type: "slider",
    sid: 81,
    data: {
        min: 0,
        max: 100
    }
}
test.config.AV["BackgroundVolume"] = {
    title: "Background Volume",
    type: "slider",
    sid: 82,
    data: {
        min: 0,
        max: 100
    }
}
test.config.AV["MICVolume"] = {
    title: "MIC Volume",
    type: "slider",
    sid: 83,
    data: {
        min: 0,
        max: 100
    }
}
test.config.AV["AudioBalance"] = {
    title: "Balance",
    type: "slider",
    sid: 84,
    data: {
        min: 0,
        max: 100
    }
}
test.config.AV["BackgroundBalance"] = {
    title: "Background Balance",
    type: "slider",
    sid: 85,
    data: {
        min: 0,
        max: 100
    }
}
test.config.AV["MICBalance"] = {
    title: "MIC Balance",
    type: "slider",
    sid: 86,
    data: {
        min: 0,
        max: 100
    }
}
test.config.AV["AudioBass"] = {
    title: "Bass",
    type: "slider",
    sid: 87,
    data: {
        min: 0,
        max: 15
    }
}
test.config.AV["AudioTreble"] = {
    title: "Treble",
    type: "slider",
    sid: 88,
    data: {
        min: 0,
        max: 15
    }
}
test.config.AV["AudioSampleFreq"] = {
    title: "Audio Sample Frequency",
    type: "list",
    sid: 89,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "44.1K",
            value: 1
        }, {
            name: "48K",
            value: 2
        }, {
            name: "88.2K",
            value: 3
        }, {
            name: "96K",
            value: 4
        }, {
            name: "176.4K",
            value: 5
        }, {
            name: "192K",
            value: 6
        }
    ]
}
test.config.AV["AudioSampleSize"] = {
    title: "Audio Sample Size",
    type: "list",
    sid: 90,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "16Bits",
            value: 1
        }, {
            name: "20Bits",
            value: 2
        }, {
            name: "24Bits",
            value: 3
        }
    ]
}
test.config.AV["AudioMute"] = {
    title: "Mute",
    type: "list",
    sid: 91,
    data: [
        {
            name: "Mute",
            value: 0
        }, {
            name: "Non-Mute",
            value: 1
        }
    ]
}
test.config.AV["AudioLoudness"] = {
    title: "Loudness",
    type: "list",
    sid: 93,
    data: [
        {
            name: "OFF",
            value: 0
        }, {
            name: "ON",
            value: 1
        }
    ]
}
test.config.AV["AudioMixMode"] = {
    title: "Mono",
    type: "list",
    sid: 94,
    data: [
        {
            name: "OFF",
            value: 0
        }, {
            name: "ON",
            value: 1
        }
    ]
}
test.config.AV["AudioStereoMode"] = {
    title: "Stereo Mode",
    type: "list",
    sid: 95,
    data: [
        {
            name: "OFF",
            value: 0
        }, {
            name: "ON",
            value: 1
        }
    ]
}
test.config.AV["AudioTalkOver"] = {
    title: "Talk-Over Mode",
    type: "list",
    sid: 96,
    data: [
        {
            name: "OFF",
            value: 0
        }, {
            name: "ON",
            value: 1
        }
    ]
}
test.config.AV["AudioAuxDelay"] = {
    title: "Aux-Delay",
    type: "slider",
    sid: 97,
    data: {
        min: 0,
        max: 15
    }
}
test.config.AV["AudioSelect"] = {
    title: "Audio Select",
    type: "list",
    sid: 98,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "HDMI",
            value: 1
        },
        {
            name: "Digital Audio",
            value: 2
        },
        {
            name: "Analog Audio",
            value: 3
        }
    ]
}
test.config.AV["AudioSelect_1"] = {
    title: "Audio Select",
    type: "list",
    sid: 98,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "HDMI",
            value: 1
        },
    ]
}
test.config.AV["AudioSelect_2"] = {
    title: "Audio Select",
    type: "list",
    sid: 98,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "HDMI",
            value: 1
        },
        {
            name: "Digital Audio",
            value: 2
        },
    ]
}
test.config.AV["AudioSelect_3"] = {
    title: "Audio Select",
    type: "list",
    sid: 98,
    data: [
        {
            name: "Auto",
            value: 0
        }, {
            name: "HDMI",
            value: 1
        },
        {
            name: "Analog Audio",
            value: 3
        }
    ]
}
test.config.AV["AudioSelect_4"] = {
    title: "Audio Select",
    type: "list",
    sid: 98,
    data: [
        {
            name: "HDMI",
            value: 1
        },
        {
            name: "Analog Audio",
            value: 3
        }
    ]
}
test.config.AV["AudioSelect_5"] = {
    title: "Audio Select",
    type: "list",
    sid: 98,
    data: [
        {
            name: "Auto",
            value: 0
        },
        {
            name: "Digital Audio",
            value: 2
        },
        {
            name: "Analog Audio",
            value: 3
        }
    ]
}
test.config.AV["MatrixAudioSource"] = {
    title: "Audio Matrix Source",
    type: "list",
    sid: 101,
    data: [
        {
            name: "Analog Audio",
            value: 0
        }, {
            name: "HDMI",
            value: 1
        }
    ]
}
test.config.AV["ARCEnable"] = {
    title: 'ARC Enabled',
    type: "list",
    sid: 102,
    data: [
        {
            name: "OFF",
            value: 0
        }, {
            name: "ON",
            value: 1
        }
    ]
}
test.config.AV["ARCAudioSource"] = {
    title: 'ARC Source Select',
    type: "list",
    sid: 103,
    data: [
        {
            name: "Analog Audio",
            value: 0
        }, {
            name: "Audio Matrix",
            value: 1
        }
    ]
}
test.config.AV["ExtAudioADir"] = {
    title: "Analog Audio Port Direction",
    type: "list",
    sid: 104,
    data: [
        {
            name: "IN",
            value: 0
        }, {
            name: "OUT",
            value: 1
        }
    ]
}
test.config.AV["ExtAudioASource_1"] = {
    title: "Analog Audio Port Source",
    type: "list",
    sid: 105,
    data: [
    		{
            name: "Audio Matrix",
            value: 0
        },
        {
            name: "HDMI",
            value: 1
        }
    ]
}
test.config.AV["ExtAudioASource"] = {
    title: "Analog Audio Port Source",
    type: "list",
    sid: 105,
    data: [
    		{
            name: "Audio Matrix",
            value: 0
        },
        {
            name: "HDMI",
            value: 1
        },
        {
            name: "ARC",
            value: 2
        }
    ]
}
test.config.AV["HDMIOutAudioSelect"] = {
    title: "HDMI Audio Source",
    type: "list",
    sid: 106,
    data: [
        {
            name: "Auto",
            value: 0
        }, 
        {
            name: "HDMI",
            value: 1
        },
        {
            name: "Analog Audio",
            value: 2
        },
        {
            name: "Audio Matrix",
            value: 3
        }
    ]
}
test.config.AV["InHDCPVersion"] = {
    title: "HDCP Version",
    type: "list",
    sid: 110,
    data: [
        {
            name: "HDCP OFF",
            value: 0
        }, {
            name: "HDCP1.4",
            value: 1
        },
        {
            name: "HDCP2.2",
            value: 2
        }
    ]
}
test.config.AV["Temperature"] = {
    title: "Temperature",
    type: "static",
    sid: 125,
    data: ''
}
test.config.AV["Voltage"] = {
    title: "Voltage",
    type: "static",
    sid: 126,
    data: ''
}
test.config.AV["R-offset"] = {
    title: "VGA R-Offset",
    type: "slider",
    sid: 152,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["OUT_HSYNC_INVERT"] = {
    title: "VGA Out HSYNC invert",
    type: "list",
    sid: 152,
    data: [
        {
            name:"OFF",
            value:0
        },
        {
            name:"ON",
            value:1
        }
    ]
}
test.config.AV["G-offset"] = {
    title: "VGA G-Offset",
    type: "slider",
    sid: 153,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["OUT_VSYNC_INVERT"] = {
    title: "VGA Out VSYNC invert",
    type: "list",
    sid: 153,
    data: [
        {
            name:"OFF",
            value:0
        },
        {
            name:"ON",
            value:1
        }
    ]
}
test.config.AV["B-offset"] = {
    title: "VGA B-Offset",
    type: "slider",
    sid: 154,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["R-gain"] = {
    title: "VGA R-Gain",
    type: "slider",
    sid: 155,
    data: {
        min: 0,
        max: 63
    }
}

test.config.AV["HDCP_0=EN_1=DIS"] = {
    title: "HDCP",
    type: "list",
    sid: 155,
    data: [
        {
            name: "HDCP ON",
            value: 0
        }, {
            name: "HDCP OFF",
            value: 1
        }
    ]
}
test.config.AV["FPGAVER_7D-05"] = {
    title: "FPGA Version",
    type: "staticList",
    sid: 155,
    data: [
        {
            name: "7D-05",
            value: 0
        }
    ]
}
test.config.AV["FWVER_4.2_0000"] = {
    title: "FW Version",
    type: "staticList",
    sid: 156,
    data: [
        {
            name: "4.2.0",
            value: 0
        }
    ]
}
test.config.AV["G-gain"] = {
    title: "VGA G-Gain",
    type: "slider",
    sid: 156,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["XTRA_0=ON_1=OFF"] = {
    title: "XTRA",
    type: "list",
    sid: 156,
    data: [
        {
            name: "ON",
            value: 0
        }, {
            name: "OFF",
            value: 1
        }
    ]
}
test.config.AV["SDI_AUDIO_SWITCH"] = {
    title: "SDI Audio Select",
    type: "slider",
    sid: 156,
    data: {
        min: 0,
        max: 15
    }
}
test.config.AV["XTRA_0Y_1N_2AUTO"] = {
    title: "XTRA",
    type: "list",
    sid: 156,
    data: [
        {
            name: "ON",
            value: 0
        }, {
            name: "OFF",
            value: 1
        }, {
            name: "Auto",
            value: 2
        }
    ]
}
test.config.AV["B-gain"] = {
    title: "VGA B-Gain",
    type: "slider",
    sid: 157,
    data: {
        min: 0,
        max: 63
    }
}
test.config.AV["ST_0IN_1OUT"] = {
    title: "Analog Audio Port Direction",
    type: "list",
    sid: 158,
    data: [
        {
            name: "IN",
            value: 0
        }, {
            name: "OUT",
            value: 1
        }
    ]
}
test.config.AV["ST_0IN_1OUT_2ARC"] = {
    title: "Analog Audio Port Direction",
    type: "list",
    sid: 158,
    data: [
        {
            name: "IN",
            value: 0
        }, {
            name: "OUT",
            value: 1
        }, {
            name: "ARC",
            value: 2
        }
    ]
}
test.config.AV["ClipperEn"] = {
    title: "Clipper",
    type: "list",
    sid: 159,
    data: [{
        name: "Normal(Not Clipper)",
        value: 0
    }, {
        name: "Clipper",
        value: 1
    }]
}
test.config.AV["AutoSyncOff"] = {
    title: "Auto SYNC OFF",
    type: "list",
    sid: 161,
    data: [{
        name: "disable",
        value: 0
    }, {
        name: "slow-5min",
        value: 1
    }, {
        name: "fast-10s",
        value: 2
    }]
}
test.config.AV["SeamlessEnable"] = {
    title: "Out Video Mode",
    type: "list",
    sid: 14,
    data: [
        {
            name: "Normal",
            value: 0
        },
        {
            name: "Seamless",
            value: 2
        }
    ]
}
test.config.AV["SeamlessMode"] = {
    title: "Seamless Mode",
    type: "list",
    sid: 15,
    data: [
        {
            name: "Normal",
            value: 0
        }, {
            name: "Window Shade",
            value: 1
        }, {
            name: "Zoom In",
            value: 2
        }
    ]
}
test.config.AV["CliperRefHSize"] = {
    title: "CliperRefHSize",
    type: "static",
    sid: 152,
    data: ''
}
test.config.AV["CliperRefVSize"] = {
    title: "CliperRefVSize",
    type: "static",
    sid: 153,
    data: ''
}
test.config.AV["SeamlessAction"] = {
    title: "Switch Transition",
    type: "list",
    sid: 154,
    data: [{
        name: "Normal(Not Seamless)",
        value: 0
    }, {
        name: "Seamless 1to1",
        value: 1
    }, {
        name: "Seamless 2to1",
        value: 2
    }, {
        name: "Seamless fade 1to1",
        value: 3
    }, {
        name: "Seamless fade 2to1",
        value: 4
    }, {
        name: "Seamless cut 1to1",
        value: 5
    }, {
        name: "Seamless cut 2to1",
        value: 6
    }]
}
test.config.AV["PiPAction"] = {
    title: "PIP",
    type: "list",
    sid: 157,
    data: [{
        name: "Normal(Not PIP)",
        value: 0
    }, {
        name: "PIP",
        value: 1
    }]
}
test.config.AV["ClipperEn"] = {
    title: "Clipper",
    type: "list",
    sid: 159,
    data: [{
        name: "Normal(Not Clipper)",
        value: 0
    }, {
        name: "Clipper",
        value: 1
    }]
}
test.config.AV["HDMIOutAudioSelect_2"] = {
    title: "HDMI Audio Source",
    type: "list",
    sid: 106,
    data: [
        {
            name: "HDMI",
            value: 1
        },
        {
            name: "Analog Audio",
            value: 2
        }
    ]
}
test.config.AV["HDMIOutAudioSelect_12"] = {
    title: "HDMI Audio Source",
    type: "list",
    sid: 106,
    data: [
        {
            name: "Auto",
            value: 0
        }, 
        {
            name: "HDMI",
            value: 1
        },
        {
            name: "Analog Audio",
            value: 2
        }
    ]
}
test.config.AV["HDMIOutAudioSelect_3"] = {
    title: "HDMI Audio Source",
    type: "list",
    sid: 106,
    data: [
        {
            name: "HDMI",
            value: 1
        },
        {
            name: "Audio Matrix",
            value: 3
        }
    ]
}
test.config.AV["HDMIOutAudioSelect_13"] = {
    title: "HDMI Audio Source",
    type: "list",
    sid: 106,
    data: [
        {
            name: "Auto",
            value: 0
        }, 
        {
            name: "HDMI",
            value: 1
        },
        {
            name: "Audio Matrix",
            value: 3
        }
    ]
}
test.config.AV["HDMIOutAudioSelect_123"] = {
    title: "HDMI Audio Source",
    type: "list",
    sid: 106,
    data: [
        {
            name: "HDMI",
            value: 1
        }, {
            name: "Analog Audio",
            value: 2
        },
        {
            name: "Audio Matrix",
            value: 3
        }
    ]
}
test.config.AV["VideoAspectRatio_0F"] = {
    title: "Out Aspect Ratio",
    type: "list",
    sid: 63,
    data: [{
        name: "1:1",
        value: 0
    }, {
        name: "4:3",
        value: 1
    }, {
        name: "16:9",
        value: 2
    }, {
        name: "Full",
        value: 3
    }]
}
test.config.AV["A10027Version"] = {
    title: "A10-027 Version",
    type: "static",
    sid: 159,
    data: ""
}
/**
 * 配置文件
 * 音频接口
 */
/**
 * 配置文件
 * 设备管理
 */
/**
 * 配置文件
 * 板卡管理
 */
/**
 * 配置文件
 * 端口管理
 */
test.PortAvOK = function (portData, index,dir) {
    var i;
    var data = {};
    data.status=true;
    data.ErrorText="";
    data.data=[];
    console.log("The value is " + JSON.stringify(portData))
    for (i = 0; i < portData.length; i++) 
    {
        if (portData[i].type != "static" || portData[i].type != "staticList") 
        {
            if (portData[i].type == "inputNum") 
            {
                // portData[i].lastervalue = portData[i].lastervalue.replace(/[^a-zA-Z0-9_-]/g, '');
                if (portData[i].lastervalue === "") 
                {
                    portData[i].lastervalue = portData.info[i].oldvalue;
                }
            }
            else if(portData[i].type == "slider")
            {
                console.log("The lastervalue is "+portData[i].lastervalue);
                if (portData[i].lastervalue === "") 
                {
                    console.log("the "+portData[i].id +"is null ");
                    portData[i].lastervalue = portData[i].oldvalue;
                }
                if(portData[i].lastervalue<portData[i].value.min||portData[i].lastervalue>portData[i].value.max)
                {
                    let error=portData[i].id+" Data Error"
                    console.log(error );
                    data.ErrorText=error;
                    break;
                }
            }
            if (portData[i].oldvalue != portData[i].lastervalue) 
            {
                console.log("have different");
                let ht = {
                    index: index,
                    sid: portData[i].sid,
                    value: portData[i].lastervalue,
                    dir:dir
                }
                test.BasePortInfo.info[i].oldvalue=portData[i].lastervalue;
                test.BasePortInfo.info[i].lastervalue=portData[i].lastervalue;
                data.data.push(ht)
            }
        }
    }
    if(i<portData.length)
    {
        data.status=false;
    }
    console.log(JSON.stringify(data));
    console.log(JSON.stringify(test.BasePortInfo.info));
    return data;
}
test.PortCancel = function () {
    test.PortInfo = {
    }
}
export default test;
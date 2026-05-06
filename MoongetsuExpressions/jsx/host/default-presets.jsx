var DefaultPresets = {
    "Dynamics": {
        "Bounce": {
            code: "amp = effect(\"M_Amp\")(\"Slider\") / 100;\r\nfreq = effect(\"M_Freq\")(\"Slider\");\r\ndecay = effect(\"M_Decay\")(\"Slider\");\r\nn = 0;\r\nif (numKeys > 0){\r\nn = nearestKey(time).index;\r\nif (key(n).time > time){ n--; }\r\n}\r\nif (n == 0){ t = 0; }\r\nelse{ t = time - key(n).time; }\r\nif (n > 0 && t < 1){\r\nv = velocityAtTime(key(n).time - .001);\r\nvalue + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\r\n}else{ value; }",
            sliders: [["M_Amp", 5], ["M_Freq", 3], ["M_Decay", 5]]
        },
        "Elastic": {
            code: "amp = effect(\"M_Amp\")(\"Slider\") / 100;\r\nfreq = effect(\"M_Freq\")(\"Slider\");\r\ndecay = effect(\"M_Decay\")(\"Slider\");\r\nn = 0;\r\nif (numKeys > 0){\r\nn = nearestKey(time).index;\r\nif (key(n).time > time){ n--; }\r\n}\r\nif (n == 0){ t = 0; }\r\nelse{ t = time - key(n).time; }\r\nif (n > 0 && t < 1){\r\nv = velocityAtTime(key(n).time - .001);\r\nvalue + v * amp * Math.cos(freq * t * 2 * Math.PI) / Math.exp(decay * t);\r\n}else{ value; }",
            sliders: [["M_Amp", 10], ["M_Freq", 5], ["M_Decay", 3]]
        },
        "Overshoot": {
            code: "freq = effect(\"M_Freq\")(\"Slider\");\r\namp = effect(\"M_Amp\")(\"Slider\");\r\ndecay = effect(\"M_Decay\")(\"Slider\");\r\nn = 0;\r\nif (numKeys > 0){\r\nn = nearestKey(time).index;\r\nif (key(n).time > time){ n--; }\r\n}\r\nif (n > 0){\r\nt = time - key(n).time;\r\ns = amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\r\nif (value instanceof Array) {\r\n  mult = []; for(i=0; i<value.length; i++) mult.push(s);\r\n  value + mult;\r\n} else {\r\n  value + s;\r\n}\r\n}else{ value; }",
            sliders: [["M_Amp", 10], ["M_Freq", 2], ["M_Decay", 5]]
        }
    },
    "Random": {
        "Wiggle": {
            code: "f = effect(\"M_Freq\")(\"Slider\");\r\na = effect(\"M_Amp\")(\"Slider\");\r\nwiggle(f, a);",
            sliders: [["M_Freq", 2], ["M_Amp", 50]]
        },
        "Wig X": {
            code: "f = effect(\"M_Freq\")(\"Slider\");\r\na = effect(\"M_Amp\")(\"Slider\");\r\nw = wiggle(f, a);\r\n[w[0], value[1]]",
            sliders: [["M_Freq", 2], ["M_Amp", 50]]
        },
        "Wig Y": {
            code: "f = effect(\"M_Freq\")(\"Slider\");\r\na = effect(\"M_Amp\")(\"Slider\");\r\nw = wiggle(f, a);\r\n[value[0], w[1]]",
            sliders: [["M_Freq", 2], ["M_Amp", 50]]
        }
    },
    "Utility": {
        "Loop": {
            code: "loopOut(\"cycle\");",
            sliders: []
        },
        "Ping": {
            code: "loopOut(\"pingpong\");",
            sliders: []
        },
        "Poster": {
            code: "fps = effect(\"M_FPS\")(\"Slider\");\r\nposterizeTime(fps);\r\nvalue;",
            sliders: [["M_FPS", 12]]
        }
    },
    "Responsive": {
        "TL": {
            code: "offset = effect(\"M_Offset\")(\"Point\");\r\n[0, 0] + offset;",
            sliders: [["M_Offset", [50, 50], "point"]]
        },
        "TR": {
            code: "offset = effect(\"M_Offset\")(\"Point\");\r\n[thisComp.width, 0] + [-offset[0], offset[1]];",
            sliders: [["M_Offset", [50, 50], "point"]]
        },
        "BL": {
            code: "offset = effect(\"M_Offset\")(\"Point\");\r\n[0, thisComp.height] + [offset[0], -offset[1]];",
            sliders: [["M_Offset", [50, 50], "point"]]
        },
        "BR": {
            code: "offset = effect(\"M_Offset\")(\"Point\");\r\n[thisComp.width, thisComp.height] - offset;",
            sliders: [["M_Offset", [50, 50], "point"]]
        },
        "Center": {
            code: "[thisComp.width/2, thisComp.height/2];",
            sliders: []
        }
    }
};

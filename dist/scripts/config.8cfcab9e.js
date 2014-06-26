! function() {
    window.CONFIG = {
        online: !1,
        populate: !0,
        debug: !1,
        hitBoxVisible: !0,
        scale: 4,
        images: {
            root: "./data/images.json"
        },
        sprites: {
            root: "./data/sprites.json"
        },
        animationGroups: {
            root: "./data/animation-groups.json",
            defaultWidth: 20,
            defaultHeight: 20
        },
        animations: {
            root: "./data/animations.json",
            defaultSpeed: .3,
            defaultLength: 10
        },
        timelines: {
            root: "./data/timelines.json"
        },
        frames: {
            root: "./data/frames.json"
        }
    }
}();

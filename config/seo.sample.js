function Seo(req) {
    this.req = req;
    this.hash = {
        default: {
          title: '集計さん',
          description: '集計さんはURLをメンバーに送るだけで、投票結果を集計できるオープンソースのツールです。'
        },
        '/form/:id/': {
            title: '集計フォーム - 集計さん'
        },
        '/result/:id/': {
            title: '集計結果 - 集計さん'
        },
        '/term': {
            title: '利用規約 - 集計さん'
        }
    };

    var cache = {};
    return new Proxy(this, {
        get: function(target, name) {
            if (name in target) {
                return target[name];
            }
            return cache[name] = function(...args) {
                return target.__noSuchMethod__.call(this, name, args);
            };
        }
    });

}

Seo.prototype.__noSuchMethod__ = function (name, args) {
    if (this.hash[this.req.route.path]) {
        return this.hash[this.req.route.path][name];
    } else {
        return this.hash['default'][name];
    }
}

module.exports = Seo;
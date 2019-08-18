module.exports = class TagHelper {
    /**
     * color by vote's ranking
     */
    colorByRanking(key) {
        let color = 'is-normal';
        if (key == 0) {
            color = 'is-danger';
        } else if (key == 1) {
            color = 'is-link';
        } else if (key == 2) {
            color = 'is-warning';
         }
        return color;
    }

    /**
     * size by vote's ranking
     */
    sizeByRanking(key) {
        let color = 'is-normal';
        if (key == 0) {
            color = 'is-large';
        } else if (key == 1) {
            color = 'is-medium';
        }
        return color;
    }
}
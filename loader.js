var Loader = {

    start: function( caption, el ) {
        // If not specified which element to set as 'loading', use the body
        if ( typeof el === 'undefined' ) {
            el = document.body;
        }
		else if ( typeof el === 'string' ) {
			el = document.querySelector(el);
		}

		this.lastEl = el;
        el.classList.add('loader--loading');

        if ( caption ) {
            el.setAttribute('data-loader-caption', caption);
        }

    },
    stop: function( el ) {
        // If not specified which element to set as 'loading', use the body
        if ( typeof el === 'undefined' ) {
            el = this.lastEl
        }

        el.classList.remove('loader--loading');
    }
};

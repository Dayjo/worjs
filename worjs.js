var found = [];
var f;
var words = [];
var letters = "";
var locks = {};
var lockreg = '';
var runTimeout;
var ignoreWords = JSON.parse(localStorage.getItem('ignoreWords')) || [];

var scores = {
	a: 1,
	e: 1,
	i: 1,
	o: 1,
	u: 1,
	b:3, c:3, d:2, f:4,
	g: 2, h: 4, j:8, k: 5,
	l:1, m:3, n:1, p:3,
	q: 10, r:1, s:1, t: 1,
	v:4, w:4, x: 8, y:4, z: 10
};

function find_words() {
    var reg = new RegExp("^(?!.*?(.).*?\1)["+letters+"]*["+letters+"]*$");
  	found = [];
    f = [];


	for ( var i in words ) {
	      w = words[i];

		  if ( ignoreWords.indexOf(w) > -1 ) {
			  continue;
		  }

	      contains = true;
	      if ( letters.length >= w.length ) {
	        tempL = letters;

	        for ( var l = 0; l < w.length; l++ ){

	          if ( tempL.indexOf(w.charAt(l)) === -1 ) {
	             if ( tempL.indexOf('*') === -1 ) {
	                contains = false;
	             }
	            else {
	                tempL = tempL.replace('*', '');
	            }
	          }
	          else {
	            tempL = tempL.replace(w.charAt(l), '');
	          }
	        }

	        if ( w.length && contains ) {
	          f.push(w);
	        }
	      }
	    }

  for ( var i in f ) {
  	var add = true;

	add = f[i].match(lockreg);

  	if ( add && f[i].length ) {
		for ( var j in letters ) {
			var num_letters = letters.split(letters[j]).length -1;
			var num_of_occurences = f[i].split(letters[j]).length-1;

			if ( num_of_occurences > num_letters ) {
				add = false;
			}
		}
	}
	else {
		add = false;
	}

	if ( add ) {
		found.push(f[i]);
	}
  }

  found.sort(function(a, b){
    return (b.length - a.length || a.localeCompare(b) ); // ASC -> a - b; DESC -> b - a
  });

  found.sort(function(a,b){
	  return score(b) - score(a);
  });

  var html = '';
  for ( i = 0; i < found.length; i++ ) {
  	html += '<li data-word="'+found[i]+'">';
  	for ( var j = 0; j<found[i].length; j++ ){
		html += '<a data-i="' + j + '">' + found[i][j] + '</a>';
  	}
	html += '<span class="score">' + score(found[i]) + '</span>';
	html += '<span class="delete">&times;</span>';
  	html += '</li>';

  }

  document.getElementById('results-list').innerHTML = '<ul>' + html + '</ul>';
	setTimeout(function(){ Loader.stop();},200);
}

function score(w){
	var score = 0;
	for( var i = 0; i < w.length; i++ ) {
		score += scores[w.charAt(i)];
	}
	return score;
}

function update_locks() {

	lockreg = '';
	var ll = 0;
	for ( var l in locks ) {

	  if ( l - ll > 1 ) {
	    for( var i = 1; i < (l-ll); i++ ){
	      lockreg += '[a-z]';
	    }
	  }

	  lockreg += locks[l];
	  ll = l;
	}
	console.log(locks);
	console.log(lockreg);

	find_words();
}

var client = new XMLHttpRequest();

client.open('GET', 'word-list-en.txt');

client.onreadystatechange = function() {

  	if ( client.readyState==4 && client.status==200 ) {
	  	file = client.responseText;
		words = file.split(/\n\r|\n/);
	}
}

client.send();

function run(e) {
	clearTimeout(runTimeout);
	Loader.start('Finding Words...', '#results-list');
	runTimeout = setTimeout(function(){


		var l = document.getElementById('letters').value.toLowerCase();
		l = l.replace(/[^a-z\*]/g,"");

		if ( letters != l ) {
			letters = l;
			locks = {}; lockreg = '';
			find_words();
		}
	}, 300);

	e.preventDefault();
	return false;

}

document.getElementById('find-words-form').addEventListener('submit', run);
document.getElementById('letters').addEventListener('keyup', run);

document.getElementById('results-list').addEventListener('click', function(event){
	if ( event.target.tagName == 'A' ) {
		var i = event.target.getAttribute('data-i');
		var char = event.target.textContent;

		if ( locks[i] == char ) {
			delete locks[i];
		} else {
			locks[i] = char;
		}

		update_locks();
	}
	else if ( event.target.classList.contains('delete') ) {
		var word = event.target.parentNode.getAttribute('data-word');
		if ( confirm("Are you sure you want to remove '"+word+"' it will be ignored!") ) {
			ignoreWords.push(event.target.parentNode.getAttribute('data-word'));
			localStorage.setItem('ignoreWords', JSON.stringify(ignoreWords));
			event.target.parentNode.parentNode.removeChild(event.target.parentNode);
		}
	}
});

var q = document.getElementById('letters');
var recognition = new webkitSpeechRecognition();
recognition.onresult = function(event) {
  if (event.results.length > 0) {
    q.value = event.results[0][0].transcript;
  }
}

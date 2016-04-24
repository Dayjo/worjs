var found = [];
var f;
var words = [];
var letters = "";
var locks = {};
var lockreg = '';

function find_words() {
    var reg = new RegExp("^(?!.*?(.).*?\1)["+letters+"]*["+letters+"]*$");
  	found = [];
    f = [];
    for ( var i in words ) {
      w = words[i];
  
      contains = w.match(reg);
  	
      if ( w.length && contains ) {
        f.push(w);
      }
    }
 

  for ( var i in f ) {
  	var add = true;

	add = (f[i].match(lockreg).length > 0);
	
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
  
  found.sort();
  found.sort(function(a, b){
  	if ( b.length == a.length ) {
  		return 0;
  	}
    return (b.length - a.length || a.localeCompare(b) ); // ASC -> a - b; DESC -> b - a
  });

  var html = '';
  for ( i = 0; i < found.length; i++ ) {
  	html += '<li>';
  	for ( var j = 0; j<found[i].length; j++ ){
		html += '<a data-i="' + j + '">' + found[i][j] + '</a>';
  	}
  	html += '</li>';
  	
  }

  document.getElementById('results-list').innerHTML = '<ul>' + html + '</ul>';

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


document.getElementById('find-words-form').addEventListener('submit', function(e){

	letters = document.getElementById('letters').value.toLowerCase();
	find_words();

	e.preventDefault();
	return false;
});

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
});

var q = document.getElementById('letters');
var recognition = new webkitSpeechRecognition();
recognition.onresult = function(event) {
  if (event.results.length > 0) {
    q.value = event.results[0][0].transcript;
  }
}

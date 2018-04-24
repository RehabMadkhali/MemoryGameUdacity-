var cardsArray = ["fa-camera-retro","fa-camera-retro", "fa-bullseye","fa-bullseye", "fa-fire","fa-fire","fa-flash", "fa-flash", "fa-tree", "fa-tree", "fa-lightbulb-o", "fa-lightbulb-o","fa-bicycle","fa-bicycle", "fa-money","fa-money"],
	opened = [],
	match = 0, steps = 0,
	secondsUsed=0, minutesUsed=0,
	$deck = jQuery('.deck'),
	$no_of_moves = $('.steps'),
	$rating = $('i'),
	$restart_button = $('.restart'),
	$seconds=$('.seconds'),
	$minutes=$('.minutes'),
	gameStart=true;
	delay = 300,
	totalCards = cardsArray.length / 2,
	threeHearts = totalCards + 2, twoHearts = totalCards + 6, oneHeart = totalCards + 10;

function shuffle(card_array) { // use to shuffle cards
  var currentIndex = card_array.length, temp, randomIndex;	
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temp = card_array[currentIndex];
    card_array[currentIndex] = card_array[randomIndex];
    card_array[randomIndex] = temp;
  }
  return card_array;
}

function startGame() { // initialize variable
  var cards = shuffle(cardsArray);
  $deck.empty();
  match = 0;
  steps = 0;
  $no_of_moves.text('0');
  $rating.removeClass('fa-heart-o').addClass('fa-heart');
	for (var i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="fa ' + cards[i] + '"></i></li>'))
	}
	addCardListener();
};

function setRating(steps) { // set number of lifes
	var heartValue = 3;
	if (steps > threeHearts && steps < twoHearts) {
		$rating.eq(2).removeClass('fa-heart').addClass('fa-heart-o');
		heartValue = 2;
	} else if (steps > twoHearts && steps < oneHeart) {
		$rating.eq(1).removeClass('fa-heart').addClass('fa-heart-o');
		heartValue = 1;
	} else if (steps > oneHeart) {
		$rating.eq(0).removeClass('fa-heart').addClass('fa-heart-o');
		heartValue = 0;
	}	
	return { score: heartValue };
};

function endGame(steps, score) { // to end games and show result
	if(score==0){
		msg_type="error";
		msg_title='You Lost!';
		msg_text='Should match in ' + steps + ' attempts and have ' + score + ' Stars.\n Time Taken: '+ minutesUsed +' Minutes -'+secondsUsed+' Seconds/';
	}
	else{
		msg_type="success";
		msg_title='Congratulations, You Won!';
		msg_text='In ' + steps + ' attempts and ' + score + ' Stars.\n Time Taken: '+ minutesUsed +' Minutes -'+secondsUsed+' Seconds/';
	}
	freezeTimer();
	swal({
		allowEscapeKey: false, allowOutsideClick: false,
		title: msg_title, text: msg_text, type: msg_type,
		confirmButtonColor: '#02ccba', confirmButtonText: 'Play again!'
	}).then(function(isConfirm) {
		if (isConfirm) {
			resetTimer();
			startGame();
		}
	})
}

$restart_button.bind('click', function() {  // handling reseting the game logic
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Are you sure?',
    text: "Your Progress will be Lost!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#02ccba',
    cancelButtonColor: '#f95c3c',
    confirmButtonText: 'Yes, Restart Game!'
  }).then(function(isConfirm) {
    if (isConfirm) {
      resetTimer();
      startGame();
    }
  })
});

var addCardListener = function() {
$deck.find('.card:not(".match, .open")').on('click' , function() {
	if(gameStart){
		startTimer();
		gameStart=false;
	}

	if($(this).hasClass("open")){ return true; } // stop counting on double clicking on card

	if($('.show').length > 1) { return true; }
	
	var $this = $(this); card = $this.context.innerHTML; $this.addClass('open show');
	opened.push(card);

  if (opened.length > 1) {
    if (card === opened[0]) {
      $deck.find('.open').addClass('match rubberBand');
      setTimeout(function() { $deck.find('.match').removeClass('open show rubberBand'); }, delay);
      match++;
    } else {
      $deck.find('.open').addClass('notmatch');
      setTimeout(function() { $deck.find('.open').removeClass('open show notmatch'); }, delay);
    }
    opened = [];
		steps++;
		setRating(steps);
		$no_of_moves.html(steps);
  }
	
		setRating(steps);
		var score = setRating(steps).score;
	if (totalCards === match || score==0 ) {
		setTimeout(function() {
			endGame(steps, score);
		}, 500);
  }
});
};

function startTimer() {  // set timer and increasing it as time goes on
	var seconds = 0;
	timer = setInterval(function() {
		seconds ++;
		secondsUsed=seconds%60;
		minutesUsed=parseInt(seconds / 60);
		$seconds.text(seconds % 60);
		$minutes.text(parseInt(seconds / 60));
	}, 1000);
}
			
function freezeTimer() { clearInterval(timer); }  // only stop timer

function resetTimer(){  // reset timer
	opened = [];
  	gameStart=true;
	$seconds.text("0");
	$minutes.text("0");
	freezeTimer();
	seconds=0;
}

startGame();  // starting the Game
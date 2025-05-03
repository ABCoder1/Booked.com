const typedHeadingSpan = document.getElementById('typed-heading');
const cursorSpan = document.querySelector('.cursor');

const title = "BOOKED.COM" ;
const typingDelay = 200;
const erasingDelay = 100;
const newTextDelay = 2000;

let charIndex = 0;

function type(){
	if(charIndex < title.length){
		if(!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
		typedHeadingSpan.textContent += title.charAt(charIndex);
		charIndex++;
		setTimeout(type, typingDelay);
	}
	else{
		cursorSpan.classList.remove('typing');
		setTimeout(erase, newTextDelay);
	}
}

function erase(){
	if(charIndex > 0){
		if(!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
		typedHeadingSpan.textContent = title.substring(0, charIndex-1);
		charIndex--;
		setTimeout(erase, erasingDelay);
	}
	else{
		// type
		cursorSpan.classList.remove('typing');
		setTimeout(type, typingDelay + 1100);
	}
}

document.addEventListener("DOMContentLoaded", function(){
	type();
});
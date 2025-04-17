// sound effects
document.querySelectorAll("#calculator-body #pad button").forEach((button) => {
	button.addEventListener("click", playClick);
});

function playClick() {
	const sound = new Audio("../assets/click.wav");
	sound.volume = 0.3;
	sound.play();
}

// calculator logic
let numberToDisplay = null;
const numberDisplay = document.getElementById("number-display");
let thereIsPeriod = false;

// buttons logic
document.querySelectorAll("#calculator-body #pad button").forEach((btn) => {
	// if control button
	if (/^[a-zA-Z]$/.test(btn.innerHTML)) {
		btn.addEventListener("click", (e) => {
			switch (btn.innerHTML) {
				case "C":
					numberToDisplay = null;
					numberDisplay.innerHTML = numberToDisplay;
					thereIsPeriod = false;
					break;

				case "X":
					if (
						numberDisplay.innerHTML.charAt(
							numberDisplay.innerHTML.length - 1
						) == "."
					) {
						thereIsPeriod = false;
					}
					numberDisplay.innerHTML = numberDisplay.innerHTML.slice(
						0,
						-1
					);

					break;
			}
		});
	}
	// if number, operator, or period
	else {
		btn.addEventListener("click", (e) => {
			// if operator (or period)
			if (
				["+", "-", "/", "*", "."].some((char) =>
					btn.innerHTML.includes(char)
				)
			) {
				// if a period and last character of display is not a number
				if (
					btn.innerHTML == "." &&
					thereIsPeriod == false &&
					(numberDisplay.innerHTML == "" ||
						!/\d/.test(
							numberDisplay.innerHTML.charAt(
								numberDisplay.innerHTML.length - 1
							)
						))
				) {
					numberToDisplay = 0 + btn.innerHTML;
					numberDisplay.innerHTML += numberToDisplay;

					thereIsPeriod = true;
				}

				// if there isnt an operator at the end of the display or if display is empty string
				if (
					!["+", "-", "/", "*", "."].some((char) =>
						numberDisplay.innerHTML
							.charAt(numberDisplay.innerHTML.length - 1)
							.includes(char)
					) &&
					!numberDisplay.innerHTML == ""
				) {
					if (btn.innerHTML == ".") {
						if (!thereIsPeriod) {
							numberToDisplay = btn.innerHTML;
							numberDisplay.innerHTML += numberToDisplay;
						}
						thereIsPeriod = true;
					} else {
						numberToDisplay = btn.innerHTML;
						numberDisplay.innerHTML += numberToDisplay;

						thereIsPeriod = false;
					}
				}
			}
			// if equals
			else if (btn.innerHTML == "=") {
				numberDisplay.innerHTML = eval(numberDisplay.innerHTML);
			}
			// if number
			else {
				numberToDisplay = btn.innerHTML;
				numberDisplay.innerHTML += numberToDisplay;
			}
		});
	}
});

// dynamic font size
function adjustFontToFit(element, minFont, maxFont) {
	let fontSize = maxFont;
	const parent = element.parentElement;

	while (fontSize >= minFont) {
		element.style.fontSize = fontSize + "px";

		if (element.scrollWidth <= parent.clientWidth * 0.94) break;

		fontSize--;
	}
}

const styles = getComputedStyle(numberDisplay);
const maxFontSize = styles
	.getPropertyValue("--number-display-max-font-size")
	.trim();
const minFontSize = styles
	.getPropertyValue("--number-display-min-font-size")
	.trim();

const observer = new MutationObserver(() => {
	adjustFontToFit(numberDisplay, minFontSize, maxFontSize);
});

observer.observe(numberDisplay, {
	childList: true,
	characterData: true,
	subtree: true,
});

let plays = document.getElementsByClassName("play");
let cards = document.getElementsByClassName("card");
for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("mouseover", () => {
        plays[i].classList.add("animatePlay");
    });
    cards[i].addEventListener("mouseout", () => {
        plays[i].classList.remove("animatePlay");
    });
}

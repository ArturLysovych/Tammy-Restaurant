let message;
let names = '';
let costs = 0;
let itemCount = 0; 
let ipAddress;
let link;
let cart = [];
let hideArr = [".howItWorks", ".ourDeliciousDish", ".ourTarget", ".downloadApp", "footer"];
let clientX;
let clientY;
let xyArr = [];

async function fetchData() {
      try {
        const response1 = await fetch('https://find-ip.openjavascript.info/');
        const data1 = await response1.json();
        const ip = data1.iso.traits.ipAddress;
        const response2 = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`);
        const data2 = await response2.json();
        link = `https://www.google.com/maps/search/?api=1&query=${data2.latitude},${data2.longitude}`;
        document.getElementById("orderingForm").addEventListener("submit", function (event) {
          let phoneNum = $("#orderInput").val();
          event.preventDefault();
          for(let el of cart){
            names+=", "+el.name;
          }
          names=names.slice(0, names.length);
          message = `
          🍕 Order : ${names} . \n
          📱 buyer number : ${phoneNum} . \n
          💰 costs : $${costs.toFixed(2)} . \n
          📍 Possible location : 
            ${link}
          `;
          if($("#orderInput").val() != '' && costs != 0){
            fetch("/send-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: "message=" + encodeURIComponent(message),
            })
            .then(function (response) {
                if (response.ok) {
                  console.log("Повідомлення відправлено");
                } else {
                  console.log("Помилка під час відправлення повідомлення");
                }
            })
            .catch(function (error) {
              console.error("Помилка під час відправлення запиту:", error);
            });
            cart = [];
            $(".cart .itemPlace .item").remove();
            $("#orderInput").val('')
            $(".cart").css("top", "-1020px");
            $(".header, .homePage, .howItWorks, .ourDeliciousDish, .ourTarget, .downloadApp, footer").css("filter", "blur(0px)");
            costs = 0;
            itemCount = 0; 
            showEl()
            names = [];
            $(".itemCount").text(0);
            $("#costs").text('$0.00')
          }else if(costs == 0 || $("#orderInput").val() == ''){
            $("#orderInput, .cart .itemPlace").css("transform", "scale(1.05)")
            $("#orderInput, .cart .itemPlace").css("border", "5px solid tomato")
            $("#orderInput, .cart .itemPlace").css("boxShadow", "0 0 5px tomato")
            setTimeout(()=>{
              $("#orderInput, .cart .itemPlace").css("transform", "scale(1)")
              $(".cart .itemPlace").css("border", "10px solid #3c3c3c")
              $("#orderInput").css("border", "0px solid #000")
              $("#orderInput, .cart .itemPlace").css("boxShadow", "0 0 0 #000")
            },1000)
          }
        });
      } catch (error) {
        return error;
      }
}
fetchData();
document.getElementById("footerForm").addEventListener("submit", function (event) {
    event.preventDefault();
    let clientEMAIL = $("#emailInput").val()
    fetch("/say-hi", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "client": clientEMAIL
      },
      body: ""
    })
      .then(function (response) {
        if (response.ok) {
          console.log("Повідомлення відправлено");
        } else {
          console.log("Помилка під час відправлення повідомлення");
        }
      })
      .catch(function (error) {
        console.error("Помилка під час відправлення запиту:", error);
      });
});

for(let i = 1; i<=8; i++){
    $(`.pizzaContainer`).append(`
        <div class="card" id="${i}">
            <img src="./images/ourDeliciousDish/pizzas/pizza${i}.svg" id="itemImage" alt="">
            <div class="stars">
                <img src="./images/ourDeliciousDish/star.svg" alt=""><img src="./images/ourDeliciousDish/star.svg" alt=""><img src="./images/ourDeliciousDish/star.svg" alt=""><img src="./images/ourDeliciousDish/star.svg" alt=""><img src="./images/ourDeliciousDish/star.svg" alt="">
            </div>
            <h2 class="cardName" id="itemName">New York Vega</h2>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting....</p>
            <div class="cardBottom">
                <div class="price" id="itemPrice">$7.10</div>
                <div>
                    <div class="addToCart"></div>
                    <div class="share"></div>
                </div>
            </div>
        </div>
    `)
}
function appendItem(){
    $('.itemPlace').empty()
    for (let i = 0; i < cart.length; i++) {
        $('.itemPlace').append(`
            <div class="item">
                <div class="leftPart">
                    <img class="itemImage" src="${cart[i].image}" alt="">
                </div>
                <div class="rightPart">
                    <h2 class="itemName">${cart[i].name}</h2>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting....</p>
                    <div class="stars">
                        <img src="./images/ourDeliciousDish/star.svg" alt=""><img src="./images/ourDeliciousDish/star.svg" alt=""><img src="./images/ourDeliciousDish/star.svg" alt=""><img src="./images/ourDeliciousDish/star.svg" alt=""><img src="./images/ourDeliciousDish/star.svg" alt="">
                    </div>
                    <p class="itemPrice">${cart[i].price}</p>
                </div>
            </div>
        `)
    }
}
function addItemToCart(item) {
    const chooseItemId = item.closest("[id]").attr("id");
    const choosePrice = $(`#${chooseItemId} .cardBottom #itemPrice`).text();
    const chooseName = $(`#${chooseItemId} #itemName`).html();
    const chooseImage = $(`#${chooseItemId} #itemImage`).attr('src');
    cart.push({ price: choosePrice, name: chooseName, image: chooseImage });
}
$(".addToCart").on("click", function() {
    const item = $(this);
    addItemToCart(item);
    appendItem();
    itemCount++;
    $(".itemCount").text(itemCount);
    costs+=7.10;
    let itemIndex;
    $(".cart .item").click(function(){
      itemIndex = $(this).index();
      console.log(itemIndex);
      cart.splice(itemIndex, 1);
      $(this).remove();
      costs-=7.10;
      itemCount--;
      $(".itemCount").text(itemCount);
      $("#costs").text("$"+costs.toFixed(2));
    })
    $("#costs").text("$"+costs.toFixed(2));
});
function hideEl(){
  for(let el of hideArr){
    $(`${el}`).hide();
  }
}
function showEl(){
  for(let el of hideArr){
    $(`${el}`).show();
  }
}
$(".openCart").on("click", function(){
    $(".cart").css("top", "20px");
    $(".header, .homePage, .howItWorks, .ourDeliciousDish, .ourTarget, .downloadApp, footer").css("filter", "blur(10px)");
    hideEl();
});
$(".back").on("click", function(){
  $(".cart").css("top", "-1020px");
  $(".header, .homePage, .howItWorks, .ourDeliciousDish, .ourTarget, .downloadApp, footer").css("filter", "blur(0px)");
  showEl();
});
$("#headerBurger").on("click", function(){
  $(".burgerMenu").fadeIn(500);
  hideEl();
  $(".homeHeader").hide();
});
$("#menuBurger").on("click", function(){
  $(".burgerMenu").fadeOut(500);
  showEl();
  $(".homeHeader").show();
});
$(".burgerMenu a").on("click", function(){
  $(".burgerMenu").fadeOut(500);
  showEl();
  $(".homeHeader").show();
});
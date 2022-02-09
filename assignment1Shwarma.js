const Order = require("./assignment1Order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    Soup:   Symbol("size"),
    Hamburger:   Symbol("toppings"),
    Cake:   Symbol("cake"),
    UpSell:  Symbol("potato"), 
    Payment: Symbol("payment")  
});

module.exports = class ShwarmaOrder extends Order{
    constructor(sNumber, sUrl)
    {
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sSoup = "";
        this.sHamburger = "";
        this.sCake = "";
        this.sUpSell  = "";
        this.sItem = "Order";
        this.sTotal=0;
        this.isTopping=false;       
        this.sUrl=sUrl;
        this.sNumber=sNumber;
    }
    handleInput(sInput)
    {
        let aReturn = [];
        console.log(this.sUrl);
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.Soup;
                aReturn.push("Welcome to Richard's soup-house. Answering questions please insert odd numbers only(0-∞).");
                aReturn.push("How many soup plates would you like($8)?");
                break;
            case OrderState.Soup:
                
                if(sInput>=0 && Number.isInteger(parseInt(sInput)))
                {
                    if(sInput>0)
                    {
                        this.sSoup = sInput+" plate(s) of soup,";
                        this.sTotal+=8*sInput;
                    }
                    else 
                    {
                        this.sSoup="no soup";
                    }
                }
                else 
                {
                    aReturn.push("please input odd numbers only from zero to many")
                    this.stateCur=OrderState.Soup;
                    aReturn.push("How many soup plates would you like($8)?");
                    break;
                }
                aReturn.push("How many hamburgers would you like($5)?");
                this.stateCur = OrderState.Hamburger
                break;
            case OrderState.Hamburger:               
                if(sInput>=0 && Number.isInteger(parseInt(sInput)))
                {
                    if(sInput>0)
                    {
                    this.sHamburger = sInput+ "hamburger(s),";
                    this.sTotal+=5*sInput;
                    }
                    else 
                    {
                        this.sHamburger="no hamburger,";
                    }
                }
                else 
                {
                    aReturn.push("please input odd numbers only from zero to many")
                    this.stateCur=OrderState.Hamburger;
                    aReturn.push("How many hamburgers would you like($5)?");
                    break;
                }               
                this.stateCur=OrderState.Cake;
                aReturn.push("How many cakes would you like($3)?");
                break;
            case OrderState.Cake:
                this.stateCur = OrderState.UpSell
                if(sInput>=0 && Number.isInteger(parseInt(sInput)))
                {
                    if(sInput>0)
                    {
                    this.sCake = sInput+"cake(s),";
                    this.sTotal+=3*sInput;
                    }
                    else 
                    {
                        this.sCake="no cake";
                    }
                }
                else 
                {
                    aReturn.push("please input odd numbers only from zero to many")
                    this.stateCur=OrderState.Cake;
                    aReturn.push("How many cakes would you like($3)?");
                    break;
                }    
                if (this.sCake=="no cake")
                {
                    aReturn.push("Thank you for your choise, ready to confirm the order(yes or no)?"); 
             
                }        
                else 
                {
                    aReturn.push("Would you like to add topping to the cake for $1, only today(yes or no)?");
                    this.isTopping=true;
                }   
                this.stateCur = OrderState.UpSell               
                break;
            case OrderState.UpSell:
                this.stateCur=OrderState.Payment;                
            if(sInput=="yes" || sInput=="no")  
            {             
                if(sInput.toLowerCase() == "yes" && this.isTopping)
                {
                    this.sUpSell = "topping";
                    this.sTotal+=1;                                      
                }
                else 
                {
                    this.sUpSell="no topping";
                }                               
                if (this.sTotal==0)
                {
                    aReturn.push("please input other than '0' positive odd numbers");
                }
                else
                {                  
                aReturn.push("Thank-you for your order of:");
                aReturn.push(`${this.sSoup} ${this.sHamburger} ${this.sCake} with ${this.sUpSell}`); // thank you for your order of soup '', 'hamburger/cheesburger', '' cake, 'with/no' topping. 
                aReturn.push(`that costs $ ${this.sTotal}`);               
                aReturn.push("Please follow the link to pay your order"+`${this.sUrl}/payment/${this.sNumber}/`);
                break;
                }
            }
            else
            {
                aReturn.push("please input 'yes' or 'no', other symbols are not allowed");
                //this.stateCur = OrderState.Upsell
                if(this.isTopping)
                {
                    aReturn.push("Would you like to add topping to the cake for $1, only today(yes or no)?");
                }
                else
                {
                    aReturn.push("Thank you for your choise, ready to confirm the order(yes or no)?"); 
                }
                this.stateCur = OrderState.UpSell
                break;
            } 
            case OrderState.Payment:
            console.log(sInput);
            this.isDone(true);
            let d = new Date();
            d.setMinutes(d.getMinutes() +20);
            aReturn.push(`Your order will be delivered at ${d.toTimeString()}`)
            break;
        }
        return aReturn;
    }
    renderForm(sTitle = "-1", sAmount = "-1")
    {
        if(sTitle !="-1")
        {
            this.sItem=sTitle;
        }
        if (sAmount !="-1")
        {
            this.sTotal=sAmount;
        }        
    const sClientID = process.env.SB_CLIENT_ID || 'AcnMuLwF6XBQMipvC2D3T5a3U4TVerJKMhJ7GFNWjuofJBGqgpYQxLPg-kiueBPUZhg2rLO9S0pZz1bj'
      return(`
    <!DOCTYPE html>
  
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
    </head>
    
    <body>
      <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
      <script
        src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
      </script>
      Thank you ${this.sNumber} for your ${this.sItem} order of $${this.sTotal}.
      <div id="paypal-button-container"></div>

      <script>
        paypal.Buttons({
            createOrder: function(data, actions) {
              // This function sets up the details of the transaction, including the amount and line item details.
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: '${this.sTotal}'
                  }
                }]
              });
            },
            onApprove: function(data, actions) {
              // This function captures the funds from the transaction.
              return actions.order.capture().then(function(details) {
                // This function shows a transaction success message to your buyer.
                $.post(".", details, ()=>{
                  window.open("", "_self");
                  window.close(); 
                });
              });
            }
        
          }).render('#paypal-button-container');
        // This function displays Smart Payment Buttons on your web page.
      </script>
    
    </body>
        
    `);

  }
}
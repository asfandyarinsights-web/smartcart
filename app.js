const add_to_list=document.getElementById("addtolist");

const item_name=document.getElementById("item-name");

const item_quantity=document.getElementById("item-quantity");

const item_price=document.getElementById("item-price");

const table=document.getElementById("table-of-items");

const categorybtn=document.querySelectorAll(".btn-category");

const searchItemButton=document.getElementById("search-item-btn");

const searchedItemName=document.getElementById("search-item-name");

const removeitembtn=document.getElementById("remove-item");

const total_tag=document.getElementById("total-amount");

const change_text_item =document.getElementById("total-text");

const change_text_bought =document.getElementById("bought-text");

const bill_text=document.getElementById("total-bill-text");

const remaining_text=document.getElementById("remaining-text");

const sortDropDown=document.getElementById("sort-dropdown");

const budgetDisplay=document.getElementById("budget-text");

const budget_limit=document.getElementById("budget-limit");

const budgetWarnningPercentage=document.getElementById("budget-warning-percentage");

console.log(budgetWarnningPercentage);


function getTotalSpent(){
    let totalspent=0;
    console.log(item_array.length);
    for(let i=0; i<item_array.length;i++){
            totalspent+=(parseFloat(item_array[i].itemPrice))*(parseFloat(item_array[i].itemQauntity));
        console.log(typeof item_array[i].itemPrice);

    }
    console.log("totalSpent is :"+totalspent);
    return totalspent;

}
function setBudget(budget){
    let percentage = (parseFloat(getTotalSpent()) / parseFloat(budget)) * 100;
    percentage = Math.min(percentage, 100); // add this cap
    percentage = Math.max(percentage, 0);   // add this floor
    budgetDisplay.innerHTML = `Rs ${budget}`;
    budgetWarnningPercentage.innerHTML = `${percentage.toFixed(0)}%`;
}
let rowsCount=0;
let totalCount=0;
let boughtCount=0;
let item_array=[];
let item={
    itemName:"",
    itemQauntity:0,
    itemPrice:0,
    itemCategory:"",
    itemStatus:"",
}
let category_value="";
for(let i=0;i<categorybtn.length ;i++){
    categorybtn[i].addEventListener("click",function(){
        if(checkboxes()){
            category_value=this.value
            console.log(category_value);
        }
        else{
            alert("Provide Name, Price, Quantity First....")
        }
        });
}
add_to_list.addEventListener("click",function(){
    if(checkboxes()){
    addItemToList(item_name.value,item_quantity.value,item_price.value,category_value);
    renderTable(getSortedItems());
    change_text_item.innerHTML=(++totalCount);
    updateStats()
    getTotalSpent();
    setBudget(budget_limit.value);
    clearBoxes();

    }
    else{
        alert("Please Provide Item Name, Price, Quantity...!");
    }

});


searchItemButton.addEventListener("click",function(){
    if(item_array.length!=0){ //array have items
        // console.log('Array Contains Items YOu Can Search');
        if(checkboxesSearch()){ //search box also have name
            searchItem(searchedItemName.value,item_array);
        }
        else{
            alert("Enter Searching Item Name Please...!");
        }

    }
    else{
        alert("No Items In Tables");        
        console.log(item_array);
        console.log('Array Is Empty');

    }
});

sortDropDown.addEventListener("change",function(){
    currentSort=this.value;
    renderTable(getSortedItems());
});

//clear textboxes 
function clearBoxes(){
    item_name.value="";
    item_quantity.value="";
    category_value="";
    item_price.value="";
}

// removeRow From Table
let obj=[];
function removeFromTable(index){
    // check if item was bought before removing
    if(item_array[index].itemStatus === "Bought"){
        boughtCount--;
        change_text_bought.innerHTML = boughtCount;
    }
    item_array.splice(index, 1);
    totalCount--;
    
    // recalculate totalBill from scratch
    totalBill = 0;
    for(let i = 0; i < item_array.length; i++){
        if(item_array[i].itemStatus === "Bought"){
            totalBill += parseFloat(item_array[i].itemPrice) * parseFloat(item_array[i].itemQauntity);
        }
    }
    
    change_text_item.innerHTML = totalCount;
    bill_text.innerHTML = "Rs :" + totalBill;
    updateStats();
    setBudget(budget_limit.value);
    renderTable(getSortedItems());
}
//input textbox validations
function checkboxes(){
    if(item_name.value!="" && item_quantity.value!="" && item_price.value!="" &&budget_limit.value!=""){
        return true;
    }
    else{
        return false;
    }
};

//Search textbox validation
function checkboxesSearch(){
    if(searchedItemName.value!=""){ //name is not empty
        return true;
    }
    else{
        return false;
    }
};
//add item object into array
function addItemToList(name,quantity,price,category){
    item={
     itemName:name,
     itemQauntity:quantity,
     itemPrice:price,
     itemCategory:category,
     itemStatus:"Pending"   
    }
    item_array.push(item);
};

// Search Item In Array
function searchItem(searchedName,searchingArray){
        let compared="";
        for(let i=0;i<item_array.length;i++){
            compared=searchingArray[i].itemName;
            console.log(`Compared Is :${compared}`);
            if(searchedName===compared){
                console.log(`${searchedName}: Item Found In Array`);
                console.log(searchingArray[i]);
            }
            else{
                console.log(`${searchedName} : Not Found In Array`);
            }
        }
}

function updateStats(){
    document.getElementById("remaining-text").innerHTML = totalCount - boughtCount;
    document.getElementById("total-bill-text").innerHTML = `Rs ${totalBill}`;
    updateSummaryCards();
    updateProgressBar();

}

function renderTable(array) {
    let table_body = table.querySelector("tbody");
    table_body.innerHTML = ""; // clear existing rows

    for (let i = 0; i < array.length; i++) {
        let obj = array[i];
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${obj.itemName}</td>
            <td>${obj.itemQauntity}</td>
            <td>${obj.itemPrice}</td>
            <td>${obj.itemCategory}</td>
            <td>${obj.itemStatus}</td>
            <td class="action-td">
                <button onclick="buyItem(${i})" class="btn btn-table">Buy</button>
                <button onclick="removeFromTable(${i})" class="btn btn-table">Remove</button>
            </td>
        `;

        table_body.appendChild(tr);
    }
}
let currentSort = "none";

function getSortedItems() {
    let sorted = [...item_array]; // copy, never touch original

    if (currentSort === "name") {
        sorted.sort((a, b) => a.itemName.localeCompare(b.itemName));
    } else if (currentSort === "price") {
        sorted.sort((a, b) => a.itemPrice - b.itemPrice);
    } else if (currentSort === "category") {
        sorted.sort((a, b) => a.itemCategory.localeCompare(b.itemCategory));
    }

    return sorted;
}
let totalBill=0;
function buyItem(id) {
    if (item_array[id].itemStatus === "Bought"){
        return; // already bought, do nothing
    } 
    else if(item_array[id].itemStatus === "Pending"){
    item_array[id].itemStatus = "Bought";
    boughtCount++;
   
    let price_item=item_array[id].itemPrice;
    let qauntity_item=item_array[id].itemQauntity;

    totalBill+=(parseFloat(price_item)*parseFloat(qauntity_item));
    
    
    
    change_text_bought.innerHTML = boughtCount;
    bill_text.innerHTML="Rs :"+totalBill;    
    remaining_text.innerHTML=item_array.length-boughtCount;

    updateStats();
    renderTable(getSortedItems());

    }
    }

    function updateProgressBar(){
    let budget = parseFloat(document.getElementById("budget-limit").value) || 0;
    let percentage = budget > 0 ? (totalBill / budget) * 100 : 0;
    percentage = Math.min(percentage, 100);
    document.getElementById("progress-bar").style.width = percentage + "%";
    document.getElementById("budget-used-text").innerHTML = percentage.toFixed(0) + "% used";
}

function updateSummaryCards(){
    if(item_array.length === 0){
        document.getElementById("most-expensive-price").innerHTML = "Rs 0";
        document.getElementById("most-expensive-name").innerHTML = "No items yet";
        document.getElementById("cheapest-price").innerHTML = "Rs 0";
        document.getElementById("cheapest-name").innerHTML = "No items yet";
        document.getElementById("bought-count-card").innerHTML = 0;
        document.getElementById("pending-count-card").innerHTML = "0 still pending";
        return;
    }

    // most expensive
    let mostExpensive = item_array.reduce(function(max, item){
        return parseFloat(item.itemPrice) > parseFloat(max.itemPrice) ? item : max;
    }, item_array[0]);

    // cheapest
    let cheapest = item_array.reduce(function(min, item){
        return parseFloat(item.itemPrice) < parseFloat(min.itemPrice) ? item : min;
    }, item_array[0]);

    // update most expensive card
    document.getElementById("most-expensive-price").innerHTML = "Rs " + mostExpensive.itemPrice;
    document.getElementById("most-expensive-name").innerHTML = mostExpensive.itemName;

    // update cheapest card
    document.getElementById("cheapest-price").innerHTML = "Rs " + cheapest.itemPrice;
    document.getElementById("cheapest-name").innerHTML = cheapest.itemName;

    // update bought card
    let pending = item_array.length - boughtCount;
    document.getElementById("bought-count-card").innerHTML = boughtCount;
    document.getElementById("pending-count-card").innerHTML = pending + " still pending";
}
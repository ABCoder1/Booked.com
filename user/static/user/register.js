function PickUserType(){
	var ManagerBtn = document.createElement("BUTTON");
	ManagerBtn.innerHTML = "MANAGER";
	var CustomerBtn = document.createElement("BUTTON");
	CustomerBtn.innerHTML = "CUSTOMER";

	document.getElementById("ManagerBtn").appendChild(ManagerBtn)
	document.getElementById("CustomerBtn").appendChild(CustomerBtn)

	ManagerBtn.onclick = function(){
		// Generate form for manager 
		var form = document.createElement("FORM");
		form.setAttribute("")
	};

	CustomerBtn.onclick = function(){
		// Generate form for customer
	};

}

PickUserType();
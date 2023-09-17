Array.prototype.random = function () {
	return this[Math.floor((Math.random()*this.length))];
}

let parts_data = {};
let total_weight = 0;
let load_limit = 0;
let total_en_load = 0;
let en_limit = 0;
let total_price = 0;


let price_limit = 1000000;

let should_allow_overweight = false;
let use_price_limit = false;
let should_randomize_weapons = true;
let exclude_notequiped = true;
let include_arm_weapons = true;



function generateFullRandomBuild() {
    const filterNotEquipped = partList => partList.filter(part => !part.name.includes("(NOT EQUIPPED)"));
	const filterBooster = partList => partList.filter(part => !part.name.includes("(N/A)"));
	const filtered_boosters = filterBooster(parts_data.boosters)


    const filtered_right_arm_units = filterNotEquipped(parts_data.right_arm_units);
    const filtered_left_arm_units = filterNotEquipped(parts_data.left_arm_units);
    const filtered_right_back_units = filterNotEquipped(parts_data.right_back_units);
    const filtered_left_back_units = filterNotEquipped(parts_data.left_back_units);
    const filtered_expansions = filterNotEquipped(parts_data.expansions);

    const right_weapons = parts_data.right_arm_units.concat(parts_data.right_back_units);
    const left_weapons = parts_data.left_arm_units.concat(parts_data.left_back_units);
    const filtered_right_weapons = filtered_right_arm_units.concat(filtered_right_back_units);
    const filtered_left_weapons = filtered_left_arm_units.concat(filtered_left_back_units);

    const new_build = {
        head: parts_data.heads.random(),
        core: parts_data.cores.random(),
        arms: parts_data.arms.random(),
        legs: parts_data.legs.random(),
        fcs: parts_data.fcs.random(),
        generator: parts_data.generators.random(),
    };

	const boosterSelect = document.getElementById("booster-select");
	if(new_build.legs.is_tank)
	{
		new_build.booster = parts_data.boosters.find(booster => booster.name === "(N/A)")
		boosterSelect.disabled = true

	} else{
		new_build.booster = filtered_boosters.random();
		boosterSelect.enabled = false
	}

    if (exclude_notequiped) {
        new_build.expansion = filtered_expansions.random();
    } else {
        new_build.expansion = parts_data.expansions.random();
    }

    if (should_randomize_weapons) {
        if (exclude_notequiped) {
            new_build.right_arm_unit = filtered_right_arm_units.random();
            new_build.left_arm_unit = filtered_left_arm_units.random();
            if (include_arm_weapons) {
                new_build.right_back_unit = filtered_right_weapons.random();
                new_build.left_back_unit = filtered_left_weapons.random();
            } else {
                new_build.right_back_unit = filtered_right_back_units.random();
                new_build.left_back_unit = filtered_left_back_units.random();
            }
        } else {
            new_build.right_arm_unit = parts_data.right_arm_units.random();
            new_build.left_arm_unit = parts_data.left_arm_units.random();
            if (include_arm_weapons) {
                new_build.right_back_unit = right_weapons.random();
                new_build.left_back_unit = left_weapons.random();
            } else {
                new_build.right_back_unit = parts_data.right_back_units.random();
                new_build.left_back_unit = parts_data.left_back_units.random();
            }
        }
    }

    return new_build;
}



function generateRandomBuild(currentBuild) {

	const filterNotEquipped = partList => partList.filter(part => !part.name.includes("(NOT EQUIPPED)"));

    const filtered_right_arm_units = filterNotEquipped(parts_data.right_arm_units);
    const filtered_left_arm_units = filterNotEquipped(parts_data.left_arm_units);
    const filtered_right_back_units = filterNotEquipped(parts_data.right_back_units);
    const filtered_left_back_units = filterNotEquipped(parts_data.left_back_units);
    const filtered_expansions = filterNotEquipped(parts_data.expansions);

    const right_weapons = parts_data.right_arm_units.concat(parts_data.right_back_units);
    const left_weapons = parts_data.left_arm_units.concat(parts_data.left_back_units);
    const filtered_right_weapons = filtered_right_arm_units.concat(filtered_right_back_units);
    const filtered_left_weapons = filtered_left_arm_units.concat(filtered_left_back_units);

    const new_build = { ...currentBuild };

    const checkboxIds = [
        "head-checkbox", "core-checkbox", "arms-checkbox",
        "legs-checkbox", "fcs-checkbox", "generator-checkbox",
        "right_arm_unit-checkbox", "left_arm_unit-checkbox",
        "right_back_unit-checkbox", "left_back_unit-checkbox",
        "booster-checkbox"
    ];

    checkboxIds.forEach(checkboxId => {
        const checkbox = document.querySelector(`#${checkboxId}`);
        if (checkbox && checkbox.checked) {
            switch (checkboxId) {
                case "head-checkbox":
                    new_build.head = parts_data.heads.random();
                    break;
                case "core-checkbox":
                    new_build.core = parts_data.cores.random();
                    break;
                case "arms-checkbox":
                    new_build.arms = parts_data.arms.random();
                    break;
                case "legs-checkbox":
                    new_build.legs = parts_data.legs.random();
                    break;
                case "fcs-checkbox":
                    new_build.fcs = parts_data.fcs.random();
                    break;
                case "generator-checkbox":
                    new_build.generator = parts_data.generators.random();
                    break;
                case "right_arm_unit-checkbox":
                    if (exclude_notequiped) {
                            new_build.right_arm_unit = filtered_right_arm_units.random();
                        }

                    else {
                            new_build.right_arm_unit = parts_data.right_arm_units.random();
                        }
                    break;
                case "left_arm_unit-checkbox":
                    if (exclude_notequiped) {
                            new_build.left_arm_unit = filtered_left_arm_units.random();
						}
                    else {

                            new_build.left_arm_unit = parts_data.left_arm_units.random();
                        }
                    break;
					
                case "right_back_unit-checkbox":
                    if (exclude_notequiped) {
                        if (include_arm_weapons) {
                            new_build.right_back_unit = filtered_right_weapons.random();
                        } else {
                            new_build.right_back_unit = filtered_right_back_units.random();
                        }
                    } else {
                        new_build.right_back_unit = include_arm_weapons ? right_weapons.random() : parts_data.right_back_units.random();
                    }
                    break;
                case "left_back_unit-checkbox":
                    if (exclude_notequiped) {
                        if (include_arm_weapons) {
                            new_build.left_back_unit = filtered_left_weapons.random();
                        } else {
                            new_build.left_back_unit = filtered_left_back_units.random();
                        }
                    } else {
                        new_build.left_back_unit = include_arm_weapons ? left_weapons.random() : parts_data.left_back_units.random();
                    }
                    break;
                case "booster-checkbox":
					const boosterSelect = document.getElementById("booster-select");
					if(new_build.legs.is_tank){
						
						new_build.booster = parts_data.boosters.find(booster => booster.name === "(N/A)")
						boosterSelect.disabled = true
						
					} else{
						const filterBooster = partList => partList.filter(part => !part.name.includes("(N/A)"));
						const filtered_boosters = filterBooster(parts_data.boosters)
                        new_build.booster = filtered_boosters.random();
						boosterSelect.disabled = false

					}
                    break;
            }
        }
    });

    if (document.querySelector("#expansion-checkbox").checked) {
        if (exclude_notequiped) {
            new_build.expansion = filtered_expansions.random();
        } else {
            new_build.expansion = parts_data.expansions.random();
        }
    }

    return new_build;
}



function isBuildValid(build) {
	if (!build.legs) return false;
    let weight = 0;
    let total_en = 0;
    let price = 0;

    Object.keys(build).forEach(function(k) {
        const part = build[k];
        if (part) { 
            weight += (k !== "legs") ? part.weight : 0;
            total_en += part.en_load ? part.en_load : 0;
            price += part.price;
			
        }
    });

    if (!should_allow_overweight && weight > build.legs.load_limit) {
		const weightError = "積載超過";
        document.getElementById("weight-error-message").textContent = weightError;
        return false;
    }

    const adjusted_en_output = build.generator.en_output * (build.core.output_adj / 100);
    if (total_en > adjusted_en_output) {
		const ENError = "EN出力不足";
        document.getElementById("en-error-message").textContent = ENError;
        return false;
    }

    if (use_price_limit && price > price_limit) {
		const COAMError = "COAM制限超過"
		document.getElementById("coam-error-message").textContent = COAMError;
        return false;
    }

	document.getElementById("weight-error-message").textContent = "";
	document.getElementById("en-error-message").textContent = "";
	document.getElementById("coam-error-message").textContent = "";


	total_weight = weight;
    load_limit = build.legs.load_limit;
    total_en_load = total_en;
    en_limit = adjusted_en_output;
    total_price = price;

    return true;
}


// ビルドを更新する関数
  function updateBuild() {
	// 各パーツの選択リストから選択されたパーツを取得
	const selectedHead = document.getElementById("head-select").value;
	const selectedCore = document.getElementById("core-select").value;
	const selectedArms = document.getElementById("arms-select").value;
	const selectedLegs = document.getElementById("legs-select").value;
	const selectedBooster = document.getElementById("booster-select").value;
	const selectedFCS = document.getElementById("fcs-select").value;
	const selectedGenerator = document.getElementById("generator-select").value;
	const selectedExpansion = document.getElementById("expansion-select").value;
	const selectedRightArmUnit= document.getElementById("right_arm_unit-select").value;
	const selectedLeftArmUnit = document.getElementById("left_arm_unit-select").value;
	const selectedRightBackUnit = document.getElementById("right_back_unit-select").value;
	const selectedLeftBackUnit = document.getElementById("left_back_unit-select").value;
	const right_weapons = parts_data.right_arm_units.concat(parts_data.right_back_units);
	const left_weapons = parts_data.left_arm_units.concat(parts_data.left_back_units);


	const build = {
		head: parts_data.heads.find(head => head.name === selectedHead),
		core: parts_data.cores.find(core => core.name === selectedCore),
		arms: parts_data.arms.find(arms => arms.name === selectedArms),
		legs: parts_data.legs.find(legs => legs.name === selectedLegs),
		booster: parts_data.boosters.find(booster => booster.name === selectedBooster),
		fcs: parts_data.fcs.find(fcs => fcs.name === selectedFCS),
		generator: parts_data.generators.find(generator => generator.name === selectedGenerator),
		expansion: parts_data.expansions.find(expansion => expansion.name === selectedExpansion),
		right_arm_unit: parts_data.right_arm_units.find(right_arm_unit => right_arm_unit.name === selectedRightArmUnit),
		left_arm_unit: parts_data.left_arm_units.find(left_arm_unit => left_arm_unit.name === selectedLeftArmUnit),
		right_back_unit: right_weapons.find(right_back_unit => right_back_unit.name === selectedRightBackUnit),
		left_back_unit: left_weapons.find(left_back_unit => left_back_unit.name === selectedLeftBackUnit),
	};

	const boosterSelect = document.getElementById("booster-select");
	if (build.legs.is_tank) {
		build.booster = parts_data.boosters.find(booster => booster.name === "(N/A)"),
        boosterSelect.disabled = true;
    } else {
        boosterSelect.disabled = false;
    }

	document.querySelector("#right_arm_unit-category").innerHTML = build.right_arm_unit.category;
	document.querySelector("#left_arm_unit-category").innerHTML = build.left_arm_unit.category;
	document.querySelector("#right_back_unit-category").innerHTML = build.right_back_unit.category;
	document.querySelector("#left_back_unit-category").innerHTML = build.left_back_unit.category;


	isBuildValid(build)	

	let weight_pct = (total_weight / load_limit) * 100;
	weight_pct = Math.round(weight_pct * 100) / 100;
	let energy_pct = (total_en_load / en_limit) * 100;
	energy_pct = Math.round(energy_pct * 100) / 100;
	document.querySelector("#weight-info").innerHTML = total_weight + " / " + load_limit + " (" + weight_pct + "%)"
	document.querySelector("#energy-info").innerHTML = total_en_load + " / " + Math.round(en_limit) + " (" + energy_pct + "%)"
	document.querySelector("#price-info").innerHTML = total_price.toLocaleString("en-US");
  }

  
  function populateSelect(selectId, partsList) {
	const select = document.getElementById(selectId);
	select.innerHTML = ""; // 選択肢をクリア
	
	partsList.forEach(function (part) {
	  const option = document.createElement("option");
	  option.value = part.name;
	  option.text = part.name;
	  select.appendChild(option);
	});
  }


function ready(fn) {
	if (document.readyState !== 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

ready(function() {
	fetch("./data.json").then(function(response) {
		response.json().then(function(data) {
			parts_data = data;
			const right_weapons = parts_data.right_arm_units.concat(parts_data.right_back_units);
			const left_weapons = parts_data.left_arm_units.concat(parts_data.left_back_units);
			populateSelect("head-select", parts_data.heads);
			populateSelect("core-select", parts_data.cores);
			populateSelect("arms-select", parts_data.arms);
			populateSelect("legs-select", parts_data.legs);
			populateSelect("booster-select", parts_data.boosters);
			populateSelect("fcs-select", parts_data.fcs);
			populateSelect("generator-select", parts_data.generators);
			populateSelect("expansion-select", parts_data.expansions);
			populateSelect("right_arm_unit-select", parts_data.right_arm_units);
			populateSelect("left_arm_unit-select", parts_data.left_arm_units);
			populateSelect("right_back_unit-select", right_weapons);
			populateSelect("left_back_unit-select", left_weapons);

		});
	});

	document.getElementById("head-select").addEventListener("change", function () {
	updateBuild(); // ビルドを更新
	});
	document.getElementById("core-select").addEventListener("change", function () {
	updateBuild(); // ビルドを更新
	});
	document.getElementById("arms-select").addEventListener("change", function () {
	updateBuild(); // ビルドを更新
	});
	document.getElementById("legs-select").addEventListener("change", function () {
	updateBuild(); // ビルドを更新
	});
	document.getElementById("booster-select").addEventListener("change", function () {
	updateBuild(); // ビルドを更新
	});
	document.getElementById("fcs-select").addEventListener("change", function () {
	updateBuild(); // ビルドを更新
	});
	document.getElementById("generator-select").addEventListener("change", function () {
	updateBuild(); // ビルドを更新
	});
	document.getElementById("expansion-select").addEventListener("change", function () {
	updateBuild(); // ビルドを更新
	});
	document.getElementById("right_arm_unit-select").addEventListener("change", function () {
	updateBuild(); // ビルドを更新
	});
	document.getElementById("left_arm_unit-select").addEventListener("change", function () {
	updateBuild(); // ビルドを更新
	});
	document.getElementById("right_back_unit-select").addEventListener("change", function () {
	updateBuild(); // ビルドを更新
	});
	document.getElementById("left_back_unit-select").addEventListener("change", function () {
	updateBuild(); // ビルドを更新
	});
	  

	
	document.querySelector("#toggle-price-option").addEventListener("click", function() {
		const price_slider = document.querySelector("#price-option");
		use_price_limit = document.querySelector("#toggle-price-option").checked;
		price_slider.disabled = !use_price_limit;
		document.querySelector("#price-value").innerHTML = parseInt(document.querySelector("#price-option").value).toLocaleString("en-US");
		if (use_price_limit) {
			document.querySelector("#price-value").style.display = "inline";
		} else {
			document.querySelector("#price-value").style.display = "none";
		}
	});

	document.querySelector("#toggle-randomize_weapon").addEventListener("click", function() {
		should_randomize_weapons = document.querySelector("#toggle-randomize_weapon").checked;
	});

	document.querySelector("#toggle-exclude_notequiped").addEventListener("click", function() {
		exclude_notequiped = document.querySelector("#toggle-exclude_notequiped").checked;
	});

	document.querySelector("#toggle-include_arm_weapons").addEventListener("click", function() {
		const right_weapons = parts_data.right_arm_units.concat(parts_data.right_back_units);
		const left_weapons = parts_data.left_arm_units.concat(parts_data.left_back_units);
		include_arm_weapons = document.querySelector("#toggle-include_arm_weapons").checked;
		if (include_arm_weapons) {
			// include_arm_weapons がONの場合、right_weapons リストに切り替える
			populateSelect("right_back_unit-select", right_weapons);
			populateSelect("left_back_unit-select", left_weapons);
		} else {
			// include_arm_weapons がOFFの場合、parts_data.right_back_units リストに切り替える
			populateSelect("right_back_unit-select", parts_data.right_back_units);
			populateSelect("left_back_unit-select", parts_data.left_back_units);
		}
	});

	document.querySelector("#toggle-overweight").addEventListener("click", function() {
		should_allow_overweight = document.querySelector("#toggle-overweight").checked;
	});

	document.querySelector("#price-option").addEventListener("input", function() {
		price_limit = document.querySelector("#price-option").value;
		document.querySelector("#price-value").innerHTML = parseInt(document.querySelector("#price-option").value).toLocaleString("en-US");
	});

	const reroll_btn = document.querySelector("#reroll");
	const fullbuild_btn = document.querySelector("#fullbuild");

	fullbuild_btn.addEventListener("click", function() {
		let build = generateFullRandomBuild();
		while (!isBuildValid(build)) {
			build = generateFullRandomBuild();
		}
		document.getElementById("head-select").value = build.head.name;
		document.getElementById("core-select").value = build.core.name;
		document.getElementById("arms-select").value = build.arms.name;
		document.getElementById("legs-select").value = build.legs.name;
		document.getElementById("booster-select").value = build.booster.name;
		document.getElementById("fcs-select").value = build.fcs.name;
		document.getElementById("generator-select").value = build.generator.name;
		document.getElementById("expansion-select").value = build.expansion.name;
		if(should_randomize_weapons){
		document.getElementById("right_arm_unit-select").value = build.right_arm_unit.name;
		document.querySelector("#right_arm_unit-category").innerHTML = build.right_arm_unit.category;
		document.getElementById("left_arm_unit-select").value = build.left_arm_unit.name;
		document.querySelector("#left_arm_unit-category").innerHTML = build.left_arm_unit.category;
		document.getElementById("right_back_unit-select").value = build.right_back_unit.name;
		document.querySelector("#right_back_unit-category").innerHTML = build.right_back_unit.category;
		document.getElementById("left_back_unit-select").value = build.left_back_unit.name;
		document.querySelector("#left_back_unit-category").innerHTML = build.left_back_unit.category;
		}
		let weight_pct = (total_weight / load_limit) * 100;
		weight_pct = Math.round(weight_pct * 100) / 100;
		let energy_pct = (total_en_load / en_limit) * 100;
		energy_pct = Math.round(energy_pct * 100) / 100;
		document.querySelector("#weight-info").innerHTML = total_weight + " / " + load_limit + " (" + weight_pct + "%)"
		document.querySelector("#energy-info").innerHTML = total_en_load + " / " + Math.round(en_limit) + " (" + energy_pct + "%)"
		document.querySelector("#price-info").innerHTML = total_price.toLocaleString("en-US");
		
	});

	reroll_btn.addEventListener("click", function() {
		let currentBuild = {
			head: parts_data.heads.find(part => part.name === document.getElementById("head-select").value),
			core: parts_data.cores.find(part => part.name === document.getElementById("core-select").value),
			arms: parts_data.arms.find(part => part.name === document.getElementById("arms-select").value),
			legs: parts_data.legs.find(part => part.name === document.getElementById("legs-select").value),
			booster: parts_data.boosters.find(part => part.name === document.getElementById("booster-select").value),
			fcs: parts_data.fcs.find(part => part.name === document.getElementById("fcs-select").value),
			generator: parts_data.generators.find(part => part.name === document.getElementById("generator-select").value),
        	expansion: parts_data.expansions.find(part => part.name === document.getElementById("expansion-select").value),
			right_arm_unit: parts_data.right_arm_units.find(part => part.name === document.getElementById("right_arm_unit-select").value),
			left_arm_unit: parts_data.left_arm_units.find(part => part.name === document.getElementById("left_arm_unit-select").value),
			right_back_unit: parts_data.right_back_units.find(part => part.name === document.getElementById("right_back_unit-select").value),
			left_back_unit:parts_data.left_back_units.find(part => part.name === document.getElementById("left_back_unit-select").value),
			};

			let build = generateRandomBuild(currentBuild);
			while (!isBuildValid(build)) {
				build = generateRandomBuild(currentBuild);
			}

		document.getElementById("head-select").value = build.head.name;
		document.getElementById("core-select").value = build.core.name;
		document.getElementById("arms-select").value = build.arms.name;
		document.getElementById("legs-select").value = build.legs.name;
		document.getElementById("booster-select").value = build.booster.name;
		document.getElementById("fcs-select").value = build.fcs.name;
		document.getElementById("generator-select").value = build.generator.name;
		document.getElementById("expansion-select").value = build.expansion.name;
		if(should_randomize_weapons){
		document.getElementById("right_arm_unit-select").value = build.right_arm_unit.name;
		document.querySelector("#right_arm_unit-category").innerHTML = build.right_arm_unit.category;
		document.getElementById("left_arm_unit-select").value = build.left_arm_unit.name;
		document.querySelector("#left_arm_unit-category").innerHTML = build.left_arm_unit.category;
		document.getElementById("right_back_unit-select").value = build.right_back_unit.name;
		document.querySelector("#right_back_unit-category").innerHTML = build.right_back_unit.category;
		document.getElementById("left_back_unit-select").value = build.left_back_unit.name;
		document.querySelector("#left_back_unit-category").innerHTML = build.left_back_unit.category;
	}
		
		let weight_pct = (total_weight / load_limit) * 100;
		weight_pct = Math.round(weight_pct * 100) / 100;
		let energy_pct = (total_en_load / en_limit) * 100;
		energy_pct = Math.round(energy_pct * 100) / 100;
		document.querySelector("#weight-info").innerHTML = total_weight + " / " + load_limit + " (" + weight_pct + "%)"
		document.querySelector("#energy-info").innerHTML = total_en_load + " / " + Math.round(en_limit) + " (" + energy_pct + "%)"
		document.querySelector("#price-info").innerHTML = total_price.toLocaleString("en-US");
	});
});

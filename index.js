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
let should_randomize_weapons = false;
let use_price_limit = false;


function generateFullRandomBuild() {
    let new_build = {
        head: parts_data.heads.random(),
        core: parts_data.cores.random(),
        arms: parts_data.arms.random(),
        legs: parts_data.legs.random(),
        fcs: parts_data.fcs.random(),
        generator: parts_data.generators.random(),
        expansion: parts_data.expansions.random()
    };
    
    if (should_randomize_weapons) {
        new_build.right_arm_unit = parts_data.right_arm_units.random();
        new_build.left_arm_unit = parts_data.left_arm_units.random();
        new_build.right_back_unit = parts_data.right_back_units.random();
        new_build.left_back_unit = parts_data.left_back_units.random();
    }
    
    if (!new_build.legs.is_tank) {
        new_build.booster = parts_data.boosters.random();
    }

    return new_build;
}

function generateRandomBuild(currentBuild) {
	let new_build = { ...currentBuild }; // 現在のビルドをコピー
	if (document.querySelector("#head-checkbox").checked) {
        new_build.head = parts_data.heads.random();
		
    }
	if (document.querySelector("#core-checkbox").checked) {
        new_build.core = parts_data.cores.random();
    }
	if (document.querySelector("#arms-checkbox").checked) {
        new_build.arms = parts_data.arms.random();
    }
	if (document.querySelector("#legs-checkbox").checked) {
        new_build.legs = parts_data.legs.random();
    }

	if (document.querySelector("#fcs-checkbox").checked) {
        new_build.fcs = parts_data.fcs.random();
    }
    
	if (document.querySelector("#generator-checkbox").checked) {
        new_build.generator = parts_data.generators.random();
    }

	if (document.querySelector("#expansion-checkbox").checked) {
        new_build.expansion = parts_data.expansions.random();
    }
    
    if (should_randomize_weapons) {
		if (document.querySelector("#right_arm_unit-checkbox").checked) {
            new_build.right_arm_unit = parts_data.right_arm_units.random();
        }
		if (document.querySelector("#left_arm_unit-checkbox").checked) {
            new_build.left_arm_unit = parts_data.left_arm_units.random();
        }
		if (document.querySelector("#right_back_unit-checkbox").checked) {
            new_build.right_back_unit = parts_data.right_back_units.random();
        }
		if (document.querySelector("#left_back_unit-checkbox").checked) {
            new_build.left_back_unit = parts_data.left_back_units.random();
        }
    }
    
    if (new_build.legs && !new_build.legs.is_tank && document.querySelector("#booster-checkbox").checked) {
        new_build.booster = parts_data.boosters.random();
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
        return false;
    }

    const adjusted_en_output = build.generator.en_output * (build.core.output_adj / 100);
    if (total_en > adjusted_en_output) {
        return false;
    }

    if (use_price_limit && price > price_limit) {
        return false;
    }

    total_weight = weight;
    load_limit = build.legs.load_limit;
    total_en_load = total_en;
    en_limit = adjusted_en_output;
    total_price = price;

    return true;
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
		});
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

		document.querySelector("#head-name").innerHTML = build.head.name;
		document.querySelector("#core-name").innerHTML = build.core.name;
		document.querySelector("#arms-name").innerHTML = build.arms.name;
		document.querySelector("#legs-name").innerHTML = build.legs.name;
		if (build.booster) {
			document.querySelector("#booster-name").innerHTML = build.booster.name;
		} else {
			document.querySelector("#booster-name").innerHTML = "(N/A)";
		}
		document.querySelector("#fcs-name").innerHTML = build.fcs.name;
		document.querySelector("#generator-name").innerHTML = build.generator.name;
		document.querySelector("#expansion-name").innerHTML = build.expansion.name;

		if (build.right_arm_unit) {
			document.querySelector("#right_arm_unit-name").innerHTML = build.right_arm_unit.name;
			document.querySelector("#right_arm_unit-category").innerHTML = build.right_arm_unit.category;
		}

		if (build.left_arm_unit) {
			document.querySelector("#left_arm_unit-name").innerHTML = build.left_arm_unit.name;
			document.querySelector("#left_arm_unit-category").innerHTML = build.left_arm_unit.category;

		}

		if (build.right_back_unit) {
			document.querySelector("#right_back_unit-name").innerHTML = build.right_back_unit.name;
			document.querySelector("#right_back_unit-category").innerHTML = build.right_back_unit.category;

		}

		if (build.left_back_unit) {
			document.querySelector("#left_back_unit-name").innerHTML = build.left_back_unit.name;
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
			head: parts_data.heads.find(part => part.name === document.querySelector("#head-name").innerHTML),
			core: parts_data.cores.find(part => part.name === document.querySelector("#core-name").innerHTML),
			arms: parts_data.arms.find(part => part.name === document.querySelector("#arms-name").innerHTML),
			legs: parts_data.legs.find(part => part.name === document.querySelector("#legs-name").innerHTML),
			fcs: parts_data.fcs.find(part => part.name === document.querySelector("#fcs-name").innerHTML),
        	booster: parts_data.boosters.find(part => part.name === document.querySelector("#booster-name").innerHTML),
			generator: parts_data.generators.find(part => part.name === document.querySelector("#generator-name").innerHTML),
        	expansion: parts_data.expansions.find(part => part.name === document.querySelector("#expansion-name").innerHTML),
			right_arm_unit: parts_data.right_arm_units.find(part => part.name === document.querySelector("#right_arm_unit-name").innerHTML),
			left_arm_unit: parts_data.left_arm_units.find(part => part.name === document.querySelector("#left_arm_unit-name").innerHTML),
			right_back_unit: parts_data.right_back_units.find(part => part.name === document.querySelector("#right_back_unit-name").innerHTML),
			left_back_unit:parts_data.left_back_units.find(part => part.name === document.querySelector("#left_back_unit-name").innerHTML),
			};

			let build = generateRandomBuild(currentBuild);
			while (!isBuildValid(build)) {
				build = generateRandomBuild(currentBuild);
			}

		document.querySelector("#head-name").innerHTML = build.head.name;
		document.querySelector("#core-name").innerHTML = build.core.name;
		document.querySelector("#arms-name").innerHTML = build.arms.name;
		document.querySelector("#legs-name").innerHTML = build.legs.name;
		if (build.booster) {
			document.querySelector("#booster-name").innerHTML = build.booster.name;
		} else {
			document.querySelector("#booster-name").innerHTML = "(N/A)";
		}
		document.querySelector("#fcs-name").innerHTML = build.fcs.name;
		document.querySelector("#generator-name").innerHTML = build.generator.name;
		document.querySelector("#expansion-name").innerHTML = build.expansion.name;

		if (build.right_arm_unit) {
			document.querySelector("#right_arm_unit-name").innerHTML = build.right_arm_unit.name;
			document.querySelector("#right_arm_unit-category").innerHTML = build.right_arm_unit.category;

		}

		if (build.left_arm_unit) {
			document.querySelector("#left_arm_unit-name").innerHTML = build.left_arm_unit.name;
			document.querySelector("#left_arm_unit-category").innerHTML = build.left_arm_unit.category;
		}

		if (build.right_back_unit) {
			document.querySelector("#right_back_unit-name").innerHTML = build.right_back_unit.name;
			document.querySelector("#right_back_unit-category").innerHTML = build.right_back_unit.category;

		}

		if (build.left_back_unit) {
			document.querySelector("#left_back_unit-name").innerHTML = build.left_back_unit.name;
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

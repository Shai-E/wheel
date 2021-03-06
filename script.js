(() => {
  const canvas = document.querySelector("#myCanvas");
  const context = canvas.getContext("2d");
  const mainContainer = document.querySelector(".main-container");
  const pointerContainer = document.querySelector(".pointer-container");
  const pointer = document.querySelector(".pointer");
  const formContainer = document.querySelector(".form-container");
  const inner = document.querySelector(".inner");
  const mainContainerBtn = document.querySelector("#containerBtn");
  const inputs = document.querySelector("#inputs");
  const wheelContainer = document.querySelector(".wheel-container");
  const canvasContainer = document.querySelector(".canvas-container");
  const spinning = document.querySelector(".spinning");
  const wheelTextContent = document.querySelector(".wheelTextContent");

  let activeBtn = null;
  let inactiveBtn = null;
  let numberOfSpins = 0;
  let spinTaps = 0;
  let currOptions = {};
  let spinResult = "";
  let goodToGo = true;

  let colors = {
    red: "#e74c3c",
    blue: "#085387",
    redish: "#e74c3c85",
  };

  const initOptions = {
    customColorsArr: [],
    maxSpins: null,
    displayPointer: true,
    removePickedSlice: false,
    container: {
      width: 300,
      display: true,
      backgroundColor: "#0A4260",
      textColor: "#fff",
      fontSize: 16,
      borderRadius: 25,
      displayCheckbox: true,
      formTitle: "Spin to Win!",
      formSubTitle: "Enter your email for the chance to win!",
      termsText: "I agree to receive an email that'll allow me to claim my prize.",
    },
    radius: 200,
    // dataArr: ["Almost!", "SEO Audit", "Sorry, try again!", "Kickstart Money Course", "Next time!", "Content Audit", "So close!", "SEO Call With My Team"],
    dataArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    buttonText: "Try My Luck",
    buttonBgColor: "#53B753",
    buttonTextColor: "#fff",
    allowCustomInputs: true,
    allowConfigGui: false,
    pointerDegrees: 45,
    pointerSize: 40,
    customPointerImgUrl: "./pointer3.png",
    onSubmit: () => {},
  };

  const setColor = (sliceIndex, customPalette) => {
    if (!customPalette || customPalette.length === 0) {
      if (currOptions.dataArr.length % 2 !== 0 && sliceIndex === 0) return colors.redish;
      if (sliceIndex % 2 === 0) {
        return colors.red;
      } else {
        return colors.blue;
      }
    } else {
      for (let customPaletteIndex = customPalette.length; customPaletteIndex > 0; customPaletteIndex--)
        if (sliceIndex % customPaletteIndex === 0) {
          return customPalette[customPaletteIndex - 1];
        }
    }
  };

  const displayBtnText = (btnElement) => {
    btnElement.innerHTML = currOptions.buttonText;
  };

  const removeBtnText = (btnElement) => {
    btnElement.innerHTML = "";
  };

  const disableBtnElement = (btnElement) => {
    btnElement.onclick = null;
    btnElement.style.setProperty("--setCursor", "default");
  };

  const disabledStyle = (btnElement) => {
    btnElement.classList.add("disabled");
    btnElement.setAttribute("disabled", true);
  };

  const enabledStyle = (btnElement) => {
    btnElement.removeAttribute("disabled");
    btnElement.classList.remove("disabled");
  };

  const isTermsValid = () => {
    const shouldDisplayTerms = currOptions.container.displayCheckbox && currOptions.container.display;
    const isTermsChecked = document.querySelector("#terms").checked;
    return (shouldDisplayTerms && isTermsChecked) || !shouldDisplayTerms;
  };
  const isEmailValid = (value) => {
    const emailValidationPattern = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    const email = document.querySelector("#email").value;
    return emailValidationPattern.test(value || email) || !currOptions.container.display;
  };

  const hideSpinsLeft = () => {
    document.querySelector("#spins-left").innerText = "";
  };
  
    const isSpinsLimited = () => {
        return currOptions.maxSpins === null;
    }

  const calcSpinsLeft = () => {
    const spinsLeft = numberOfSpins < currOptions.maxSpins ? currOptions.maxSpins - numberOfSpins - 1 : 0;
    document.querySelector("#spins-left").innerText = `Spins You Have Left: ${
        isSpinsLimited() ? "Unlimited" : spinsLeft
    }`;
    return spinsLeft;
  };

  const isNumberOfSpinsValid = (numberOfSpins) => {
    return numberOfSpins < currOptions.maxSpins;
  };

  const isGoodToGo = () => {
    return (currOptions.removePickedSlice && goodToGo) || !currOptions.removePickedSlice;
  };

  const enableBtnElement = () => {
    displayBtnText(activeBtn);
    if (
      isTermsValid() &&
      (isNumberOfSpinsValid(numberOfSpins) || isSpinsLimited()) &&
      isEmailValid() &&
      isGoodToGo()
    ) {
      activeBtn.onclick = () => spin();
      activeBtn.style.setProperty("--setCursor", "pointer");
      enabledStyle(activeBtn);
    } else {
      disableBtnElement(activeBtn);
      disabledStyle(activeBtn);
    }
  };

  const initDisplayPointer = () => {
    pointerContainer.style.display = currOptions.displayPointer ? "flex" : "none";
    pointerContainer.style.setProperty("--pointerDegrees", currOptions.pointerDegrees);
  };
  const initDisplayForm = () => {
    formContainer.style.display = currOptions.container.display ? "flex" : "none";
    formContainer.style.setProperty("--width", currOptions.container.width);
  };
  const initMainContainer = () => {
    mainContainer.style.setProperty("--width", currOptions.container.display ? currOptions.container.width : 0);
    mainContainer.style.setProperty(
      "--borderRadius",
      currOptions.container.display ? currOptions.container.borderRadius : currOptions.radius
    );
    mainContainer.style.setProperty("--backgroundColor", currOptions.container.backgroundColor);
  };
  const initMainContainerBtn = () => {
    mainContainerBtn.style.setProperty("--btnBackgroundColor", currOptions.buttonBgColor);
    mainContainerBtn.style.setProperty("--btnTextColor", currOptions.buttonTextColor);
  };

  const initInputsDisplay = () => {
    inputs.style.display = currOptions.allowCustomInputs ? "flex" : "none";
  };

  const initSettingsGui = () => {
    mainContainerBtn.innerHTML = currOptions.buttonText;
    document.querySelector("#formTitle").innerHTML = currOptions.container.formTitle;
    document.querySelector("#formSubTitle").innerHTML = currOptions.container.formSubTitle;
    document.querySelector("#pointerPosition").value = currOptions.pointerDegrees;
    document.querySelector("#containerWidth").value = currOptions.container.width;
    document.querySelector("#wheelRadius").value = currOptions.radius;
    document.querySelector("#pointerSize").value = currOptions.pointerSize;
    if (currOptions.maxSpins !== null) document.querySelector("#maxSpins").value = currOptions.maxSpins;
    document
      .querySelectorAll(".ifContainer")
      .forEach((i) => (i.style.display = currOptions.container.display ? "flex" : "none"));
    document
      .querySelectorAll(".ifTerms")
      .forEach(
        (i) =>
          (i.style.display = currOptions.container.displayCheckbox && currOptions.container.display ? "flex" : "none")
      );
  };

  const initPointerImg = () => {
    pointer.src = currOptions.customPointerImgUrl;
  };

  const initGuiDisplay = () => {
    if (currOptions.allowConfigGui) {
      document.querySelector("#config-menu").style.display = "flex";
      document.querySelector("#config-menu-label").style.display = "flex";
    } else {
      document.querySelector("#config-menu").style.display = "none";
      document.querySelector("#config-menu-label").style.display = "none";
    }
  };

  const initDisplayTerms = () => {
    if (currOptions.container.displayCheckbox) {
      document.querySelector("#termsText").innerHTML = currOptions.container.termsText;
      document.querySelector("#termsContainer").style.display = "flex";
    } else {
      document.querySelector("#termsContainer").style.display = "none";
    }
  };

  const resetInactiveBtn = (inactiveBtn) => {
    disableBtnElement(inactiveBtn);
    enabledStyle(inactiveBtn);
  };

  const initActiveBtn = () => {
    activeBtn = currOptions.container.display ? mainContainerBtn : inner;
    inactiveBtn = !currOptions.container.display ? mainContainerBtn : inner;
    enableBtnElement(activeBtn);
    disableBtnElement(inactiveBtn);
    resetInactiveBtn(inactiveBtn);
    removeBtnText(inactiveBtn);
  };

  const executeFunctions = (functionArr) => {
    functionArr.forEach((func) => func());
  };

  const initWheelOptions = () => {
    executeFunctions([
      initPointerImg,
      initDisplayPointer,
      initDisplayForm,
      initMainContainer,
      initMainContainerBtn,
      initInputsDisplay,
      initSettingsGui,
      initDisplayTerms,
      initActiveBtn,
      initGuiDisplay,
      calcSpinsLeft,
    ]);
  };

  const setWheelSliceContent = (i, radius, dataArr) => {
    const div = document.createElement("div");
    const span = document.createElement("span");
    div.className = `text`;
    span.className = `text-span`;

    const degrees = 360 / dataArr.length;
    div.style.setProperty("--portion", degrees);
    div.style.setProperty("--half", dataArr.length % 2 === 0 ? degrees / 2 : degrees);
    div.style.setProperty("--rotation", i);
    div.style.setProperty("--radius", radius);
    span.innerHTML = dataArr[i];
    span.style.setProperty("--radius", radius);
    div.append(span);
    wheelTextContent.style.setProperty("--radius", radius);
    wheelTextContent.append(div);
  };

  const setWheelSliceStyle = (i, radius, dataArr, customColorsArr) => {
    context.fillStyle = setColor(i, customColorsArr);
    context.strokeStyle = i % 2 === 0 ? "black" : "black";
    const portion = (Math.PI * 2) / dataArr.length;
    context.beginPath();
    context.moveTo(radius, radius);
    context.stroke();
    context.arc(radius, radius, radius, Math.PI / 2 + i * portion, Math.PI / 2 + (i + 1) * portion, false);
    context.fill();
  };

  const saveUserOptionsToLocalStorage = () => {
    localStorage.setItem("wheel-preferences", JSON.stringify(currOptions));
  };

  const setWheelStyle = ({ radius }) => {
    mainContainer.style.setProperty("--radius", radius);
    wheelContainer.style.setProperty("--radius", radius);
    canvasContainer.style.setProperty("--radius", radius);
    inner.style.setProperty("--radius", radius);
    spinning.style.setProperty("--radius", radius);
    canvas.width = radius * 2;
    canvas.height = radius * 2;
    context.clearRect(0, 0, radius * 2, radius * 2);
  };

  const resetWheelContent = () => {
    wheelTextContent.innerHTML = "";
  };

  const createWheelSlices = ({ radius, dataArr, customColorsArr }) => {
    dataArr.forEach((_dataItem, i) => createWheelSlice(i, radius, dataArr, customColorsArr));
  };

  const createWheelSlice = (i, radius, dataArr, customColorsArr) => {
    setWheelSliceStyle(i, radius, dataArr, customColorsArr);
    setWheelSliceContent(i, radius, dataArr);
  };

  const createWheel = (options) => {
    currOptions = { ...initOptions, ...options, container: { ...initOptions.container, ...options?.container } };
    saveUserOptionsToLocalStorage();
    initWheelOptions();
    setWheelStyle(currOptions);
    resetWheelContent();
    unlimitWheel();
    createWheelSlices(currOptions);
  };

  document.querySelector("#inputs")?.addEventListener("keyup", (e) => {
    const arr = e.target.value.split("\n").filter((i) => i != false);
    const options = JSON.parse(localStorage.getItem("wheel-preferences"));
    createWheel({ ...options, dataArr: arr });
  });

  document.querySelector("#useContainer")?.addEventListener("click", (e) => {
    const checked = e.target.checked;
    const options = JSON.parse(localStorage.getItem("wheel-preferences"));
    createWheel({ ...options, container: { ...options.container, display: checked } });
  });

  document.querySelector("#formTitleInput")?.addEventListener("keyup", (e) => {
    const title = e.target.value;
    const options = JSON.parse(localStorage.getItem("wheel-preferences"));
    createWheel({ ...options, container: { ...options.container, formTitle: title } });
  });

  document.querySelector("#formSubTitleInput")?.addEventListener("keyup", (e) => {
    const subTitle = e.target.value;
    const options = JSON.parse(localStorage.getItem("wheel-preferences"));
    createWheel({ ...options, container: { ...options.container, formSubTitle: subTitle } });
  });

  document.querySelector("#pointerPosition")?.addEventListener("input", (e) => {
    const pointerPosition = e.target.value;
    const options = JSON.parse(localStorage.getItem("wheel-preferences"));
    createWheel({ ...options, pointerDegrees: pointerPosition });
  });

  document.querySelector("#wheelRadius")?.addEventListener("input", (e) => {
    const radius = e.target.value;
    const options = JSON.parse(localStorage.getItem("wheel-preferences"));
    createWheel({ ...options, radius: radius });
  });
  document.querySelector("#containerWidth")?.addEventListener("input", (e) => {
    const width = e.target.value;
    const options = JSON.parse(localStorage.getItem("wheel-preferences"));
    createWheel({ ...options, container: { ...options.container, width } });
  });
  document.querySelector("#isTermsCheckboxRequired")?.addEventListener("click", (e) => {
    const checked = e.target.checked;
    const options = JSON.parse(localStorage.getItem("wheel-preferences"));
    createWheel({ ...options, container: { ...options.container, displayCheckbox: checked } });
  });
  let currMaxSpinsValue =
    JSON.parse(localStorage.getItem("wheel-preferences"))?.maxSpins || +document.querySelector("#maxSpins").value;

  document.querySelector("#maxSpins").addEventListener("input", (e) => {
    if (currMaxSpinsValue !== null) currMaxSpinsValue = +e.target.value;
    const options = JSON.parse(localStorage.getItem("wheel-preferences"));
    createWheel({ ...options, maxSpins: currMaxSpinsValue });
    hideSpinsLeft();
  });

  document.querySelector("#pointerSize").addEventListener("input", (e) => {
    const pointerSize = +e.target.value;
    currOptions.pointerSize = pointerSize;
    document.querySelector(".pointer").style.setProperty("--pointerSize", pointerSize);
    saveUserOptionsToLocalStorage();
  });

  document.querySelector("#isUnlimitedSpins")?.addEventListener("click", (e) => {
    const checked = e.target.checked;
    const currValue = +document.querySelector("#maxSpins").value;
    currMaxSpinsValue = checked ? null : currValue;
    const options = JSON.parse(localStorage.getItem("wheel-preferences"));
    createWheel({ ...options, maxSpins: currMaxSpinsValue });
    hideSpinsLeft();
  });

  document.querySelector("#isRemoveEnabled")?.addEventListener("click", (e) => {
    const checked = e.target.checked;
    const options = JSON.parse(localStorage.getItem("wheel-preferences"));
    createWheel({ ...options, removePickedSlice: checked });
  });

  document.querySelector("#termsTextInput")?.addEventListener("keyup", (e) => {
    const value = e.target.value;
    const options = JSON.parse(localStorage.getItem("wheel-preferences"));
    createWheel({ ...options, container: { ...options.container, termsText: value } });
  });

  document.querySelector("#customPointer")?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const newImgUrl = URL.createObjectURL(file);
    currOptions.customPointerImgUrl = newImgUrl;
    document.querySelector(".pointer").src = newImgUrl;
    saveUserOptionsToLocalStorage();
  });

  const changeBtnDisabledStatusByValidityOfInputs = () => {
    initActiveBtn();
    enableBtnElement(activeBtn);
  };

  document.querySelector("#email")?.addEventListener("keyup", (e) => {
    changeBtnDisabledStatusByValidityOfInputs();
  });

  document.querySelector("#terms")?.addEventListener("change", (e) => {
    changeBtnDisabledStatusByValidityOfInputs(e.target.checked);
  });

  document.querySelector(".config-menu-backdrop")?.addEventListener("click", (e) => {
    document.querySelector("#config-menu-checkbox").checked = false;
  });

  const randNumOfSpins = () => Math.floor(Math.random() * 10000);

  const limitSpins = () => {
    if (!isNumberOfSpinsValid(numberOfSpins) && !isSpinsLimited()) {
      disableBtnElement(activeBtn);
      disabledStyle(activeBtn);
    }
  };

  const unlimitWheel = () => {
    initActiveBtn();
    activeBtn.onclick = () => spin(activeBtn);
    numberOfSpins = 0;
    if (isEmailValid() && (isNumberOfSpinsValid(numberOfSpins) || isSpinsLimited()))
      enabledStyle(activeBtn);
  };
  const increaseNumberOfSpins = () => {
    numberOfSpins++;
    currOptions.spinsLeft = numberOfSpins;
  };

  const calcResult = () => {
    const numberOfSlices = currOptions.dataArr.length;
    const isOdd = numberOfSlices % 2 !== 0;
    const slicePortion = 360 / numberOfSlices;
    const currDegAfterSpin = (spinTaps % 360) - currOptions.pointerDegrees + (isOdd ? slicePortion / 2 : 0);
    const fullDeg = currDegAfterSpin / slicePortion;
    const isBackwards2 = fullDeg < 0;
    const spinDeg = Math.floor(fullDeg - slicePortion * numberOfSpins);
    const isBackwards = spinDeg < 0;

    let resultIndex = isBackwards ? Math.floor(Math.abs(fullDeg)) : spinDeg;

    const getResult = () => {
      const newArr = isBackwards2 && isBackwards ? [...currOptions.dataArr] : [...currOptions.dataArr].reverse();
      spinResult = newArr[resultIndex];
      removePickedSlice(
        spinResult,
        newArr.filter((_v, i) => i !== resultIndex)
      );
      return spinResult;
    };
    getResult();
  };

  const removePickedSlice = (spinResult, newArr) => {
    goodToGo = false;
    setTimeout(() => {
      if (currOptions.removePickedSlice && confirm("Your result is: " + spinResult + ". Remove result from wheel?")) {
        currOptions.dataArr = newArr;
        context.clearRect(0, 0, currOptions.radius * 2, currOptions.radius * 2);
        wheelTextContent.innerHTML = "";
        createWheelSlices(currOptions);
      }
      document.querySelector("#result").innerText = "Last Spin Result: " + spinResult;
      goodToGo = true;
      enableBtnElement(activeBtn);
    }, 3000);
  };

  const spin = () => {
    if (!isEmailValid() && currOptions.container.display) {
      return;
    }
    const rand = spinTaps + randNumOfSpins();
    document.querySelector(".spinning").style.setProperty("--random", rand);
    spinTaps = rand;
    calcResult();
    calcSpinsLeft();
    increaseNumberOfSpins();
    initActiveBtn();
    limitSpins();
    currOptions.onSubmit();
  };

  createWheel({ allowConfigGui: true });

  // TODO: Upload file to customize pointer
  // TODO: Add "spins you have left", "display result", "spin speed" and "spin time" to settings
  // TODO: Improve UI
})();

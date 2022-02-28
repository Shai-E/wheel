(()=>{
    const canvas = document.querySelector("#myCanvas")
    const context = canvas.getContext('2d');
    let numberOfSpins = 0;
    
    let colors = {
        red: "#e74c3c",
        blue: "#085387"
    }
    
    const initOptions = {
        customColorsArr: [],
        maxSpins: 1,
        container: {
            width: 300,
            display: true,
            backgroundColor: "#0A4260",
            textColor: "#fff",
            fontSize: 16,
            borderRadius: 25,
            displayPointer: true,
            displayCheckbox: true,
            formTitle: "Spin to Win!",
            formSubTitle: "Enter your email for the chance to win!",
            termsText: "I agree to receive an email that'll allow me to claim my prize and helpful email series from BloggersIdeas.com", 
        },
        radius: 200,
        dataArr: ["Almost!", "SEO Audit", "Sorry, try again!", "Kickstart Money Course", "Next time!", "Content Audit", "So close!", "SEO Call With My Team"],
        buttonText: "Try My Luck",
        buttonBgColor: "#53B753",
        buttonTextColor: "#fff",
        allowCustomInputs: true,
        allowConfigGui: false,
        pointerDegrees: 45,
        customPointerImgUrl: "./pointer3.png",
    }
    
    const setColor = (i ,cc) => {
    
        if(!cc || cc.length === 0){
            if(i%2===0) {
                return colors.red
            } else {
                return colors.blue
            }
        } else{
            for(let cci = cc.length ; cci >0; cci--)
            if(i%cci===0) {
                return cc[cci-1]
            }
        }
    }
    
    const createContainer = ({  container: { displayPointer, display, borderRadius, width, backgroundColor, displayCheckbox}, 
                                radius, buttonBgColor, buttonTextColor, buttonText, pointerDegrees, allowCustomInputs, maxSpins, customPointerImgUrl }) => {
        const mainContainer = document.querySelector(".main-container");
        const pointerContainer = document.querySelector('.pointer-container');
        const pointer = document.querySelector('.pointer');
        const formContainer = document.querySelector('.form-container');
        const inner = document.querySelector(".inner");
        const mainContainerBtn = document.querySelector(".btn");
        const inputs = document.querySelector("#inputs");


        pointer.src = customPointerImgUrl;
        const initDisplayPointer = (() => {
            pointerContainer.style.display = displayPointer ? "flex" : "none";
            pointerContainer.style.setProperty("--pointerDegrees", pointerDegrees);
        })();
        const initDisplayForm = (() => {
            formContainer.style.display = display ? "flex" : "none";
            formContainer.style.setProperty("--width", width);
        })();
        const initMainContainer = (() => {
            mainContainer.style.setProperty("--width", display ? width : 0);
            mainContainer.style.setProperty("--borderRadius", display ? borderRadius : radius);
            mainContainer.style.setProperty("--backgroundColor", backgroundColor);
        })();
        const initMainContainerBtn = (() => {
            mainContainerBtn.style.setProperty("--btnBackgroundColor", buttonBgColor);
            mainContainerBtn.style.setProperty("--btnTextColor", buttonTextColor);
        })();
        
        const initInputsDisplay = (()=>{
            inputs.style.display = allowCustomInputs ? "flex" : "none";
        })()
        if(!display) {
            inner.innerHTML = buttonText;
            inner.onclick = ()=>spin(inner, maxSpins, displayCheckbox);
            inner.style.setProperty("--setCursor", "pointer")
        } else {
            inner.innerHTML ="";
            inner.onclick = null;
            inner.style.setProperty("--setCursor", "default")
            inner.classList.remove("disabled");

            const disableSpin = () => {
                mainContainerBtn.setAttribute("disabled", true);
                mainContainerBtn.classList.add("disabled");
            };
            const enableSpin = () => {
                mainContainerBtn.removeAttribute("disabled");
                mainContainerBtn.classList.remove("disabled");
            }
            if (displayCheckbox) {
                const terms = document.querySelector("#terms");
                const handleBtnDisablePropOnTermsStateChange = (() => {
                    terms.checked === false && disableSpin();
                    terms.addEventListener("click", (e) => {
                        const {target: {checked}} = e;
                        checked ? enableSpin() : disableSpin();
                    })
                })();
            }
        } 
    
    }
    
    const createWheelSlice = (i, radius, dataArr, customColorsArr) => {
        context.fillStyle = setColor(i, customColorsArr);
            context.strokeStyle = i%2===0?"black":"black";
            const portion = (Math.PI*2)/dataArr.length;
            context.beginPath();
            context.moveTo(radius, radius);
            context.stroke();
            context.arc(radius,radius,radius,Math.PI/2+(i*portion), Math.PI/2+(i+1)*portion, false); 
            context.fill();
            
            const div = document.createElement('div');
            const span = document.createElement('span');
            div.className = `text`;
            span.className = `text-span`;
            const degrees = 360/dataArr.length;
            div.style.setProperty("--portion", degrees);
            div.style.setProperty("--half", dataArr.length%2===0?degrees/2:degrees);
            div.style.setProperty("--rotation", i);
            div.style.setProperty("--radius", radius);
            span.innerHTML = dataArr[i];
            span.style.setProperty("--radius", radius);
            div.append(span);
            const info = document.querySelector(".info")
            info.style.setProperty("--radius", radius);
            info.append(div);
    }
    
    const createWheel=(options)=>{
        let formattedOptions = {...initOptions, ...options, container:{ ...initOptions.container, ...options?.container }};
        localStorage.setItem("wheel-preferences",JSON.stringify(formattedOptions))
        createContainer( formattedOptions )
        document.querySelector("#spinBtn").innerHTML = formattedOptions.buttonText;
        document.querySelector("#formTitle").innerHTML = formattedOptions.container.formTitle;
        document.querySelector("#formSubTitle").innerHTML = formattedOptions.container.formSubTitle;
        document.querySelector("#pointerPosition").value = formattedOptions.pointerDegrees;

        if(formattedOptions.allowConfigGui) {
            //config-menu
            //config-menu-label
            document.querySelector("#config-menu").style.display = 'flex';
            document.querySelector("#config-menu-label").style.display = 'flex';
            
        } else {
            document.querySelector("#config-menu").style.display = 'none';
            document.querySelector("#config-menu-label").style.display = 'none';
        }

        if(formattedOptions.container.displayCheckbox) {
            document.querySelector("#termsText").innerHTML = formattedOptions.container.termsText;
            document.querySelector("#termsContainer").style.display = 'flex';
        } else {
            document.querySelector("#termsContainer").style.display = 'none';
        }

        //isTermsCheckboxRequired
    
        const { radius, container: {display, displayCheckbox}, maxSpins, dataArr, customColorsArr } = formattedOptions;
        const mainContainer = document.querySelector(".main-container");
        const wheelContainer = document.querySelector(".wheel-container");
        const canvasContainer = document.querySelector(".canvas-container");
        const inner = document.querySelector(".inner");
        const spinning = document.querySelector(".spinning");
        mainContainer.style.setProperty("--radius", radius);
        wheelContainer.style.setProperty("--radius", radius);
        canvasContainer.style.setProperty("--radius", radius);
        inner.style.setProperty("--radius", radius);
        spinning.style.setProperty("--radius", radius);
        canvas.width = radius*2;
        canvas.height = radius*2;
        context.clearRect(0,0,radius*2, radius*2);
        document.querySelector(".info").innerHTML = "";
        const btn = document.querySelector(".btn");
        unlimitWheel(display ? btn : inner, maxSpins, displayCheckbox);
        dataArr.forEach((_dataItem, i)=>createWheelSlice(i, radius, dataArr, customColorsArr))
    }
    
    document.querySelector("#inputs")?.addEventListener("keyup", (e)=>{
        const arr = e.target.value.split("\n");
        const options = JSON.parse(localStorage.getItem("wheel-preferences"));
        createWheel({...options, dataArr: arr});
    });

    document.querySelector("#useContainer")?.addEventListener("click", (e)=>{
        const checked = e.target.checked
        const options = JSON.parse(localStorage.getItem("wheel-preferences"));
        createWheel({...options, container: {...options.container, display: checked}});
    });

    document.querySelector("#formTitleInput")?.addEventListener("keyup", (e)=>{
        const title = e.target.value
        const options = JSON.parse(localStorage.getItem("wheel-preferences"));
        createWheel({...options, container: {...options.container, formTitle: title}});
    });

    document.querySelector("#formSubTitleInput")?.addEventListener("keyup", (e)=>{
        const subTitle = e.target.value
        const options = JSON.parse(localStorage.getItem("wheel-preferences"));
        createWheel({...options, container: {...options.container, formSubTitle: subTitle}});
    });

    document.querySelector("#pointerPosition")?.addEventListener("input", (e)=>{
        const pointerPosition = e.target.value
        const options = JSON.parse(localStorage.getItem("wheel-preferences"));
        createWheel({...options, pointerDegrees: pointerPosition});
    });

    document.querySelector("#isTermsCheckboxRequired")?.addEventListener("click", (e)=>{
        const checked = e.target.checked
        const options = JSON.parse(localStorage.getItem("wheel-preferences"));
        createWheel({...options, container: {...options.container, displayCheckbox: checked}});
    });

    document.querySelector("#termsTextInput")?.addEventListener("keyup", (e)=>{
        const value = e.target.value
        const options = JSON.parse(localStorage.getItem("wheel-preferences"));
        createWheel({...options, container: {...options.container, termsText: value}});
    });

    //termsText
    
    let spinTaps = 0;
    const randNumOfSpins = () => Math.floor(Math.random()*10000);
    
    const limitSpins=(element, limitNumberOfSpins, shouldLimit) =>{
        if (!shouldLimit) return;
        if(numberOfSpins>=limitNumberOfSpins){
            element.onclick = "";
            element.classList.toggle("disabled");
        }
    };
    const unlimitWheel = (element, limit, shouldLimit)=> {
        element.onclick = ()=>spin(element, limit, shouldLimit);
        element.classList.remove("disabled");
        numberOfSpins = 0;
    }
    const increaseNumberOfSpins = () => {
        numberOfSpins++;
    };
    
    function spin (element ,limit, shouldLimit) {
        increaseNumberOfSpins();
        const rand = spinTaps+randNumOfSpins();
        document.querySelector(".spinning").style.setProperty("--random", rand);
        spinTaps=rand;
        limitSpins(element, limit, shouldLimit);
    };
    
    createWheel({ allowConfigGui: true })
})()
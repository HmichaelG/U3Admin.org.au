window.addEventListener("load", () => {
    function sendData() {
        const xhr = new XMLHttpRequest();
        const okModal = bootstrap.Modal.getOrCreateInstance('#modal');
        const errModal = bootstrap.Modal.getOrCreateInstance('#errModal');

        // Bind the FormData object and the form element
        const FD = new FormData(form);

        xhr.onreadystatechange = () => {
            // Call a function when the state changes.
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var btn = document.getElementById("submitButton");
                    btn.innerText = 'Your request has been successfully submitted!'
                    btn.disabled = true;
                    document.getElementById("contactForm").reset();
                    document.getElementById("page-top").focus();
                    okModal.show();
                }
                else {
                    if (xhr.responseText) {
                        document.getElementById("errorMsg").innerHTML = "reCaptcha Error: " + xhr.responseText;
                    }
                    else {
                        document.getElementById("errorMsg").innerHTML = "Error: rejected by Google reCaptcha";
                    }
                    errModal.show();
                }
            }
        };

        // open the URL
        xhr.open("POST", getURL("ContactRequest"));
        // The data sent is what the user provided in the form
        xhr.send(FD);

    }

    // Get the form element
    const form = document.getElementById("contactForm");

    // Add 'submit' event handler
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            sendData();
        });
    }

    // Google reCaptcha setup
    grecaptcha.ready(function () {
        setCaptchaToken();
        setInterval(function () { setCaptchaToken(); },2 * 60 * 1000);
    });

    function setCaptchaToken() {
        getClientKey(function (responseText) {
            var key = responseText;
            grecaptcha.execute(key, { action: "homepage" }).then(function (token) {
                document.getElementById("token").value = token;
            });
        });
        var btn = document.getElementById("submitButton");
        btn.innerText = 'Submit'
        btn.disabled = false;
    }

    function getClientKey(fnCallback) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            // Call a function when the state changes.
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                fnCallback(xhr.responseText);
            }
        }

        // open the URL
        xhr.open("GET", getURL("ReCaptchaClient"));
        xhr.send();

    }; // getClientKey

    function getURL(functionName) {
        var url = document.URL;
        if (url.startsWith("http://localhost")) {
            return "http://localhost:7071/api/" + functionName;
        }
        else {
            return "https://u3alinuxfunctions.azurewebsites.net/api/" + functionName;
        }
    } // getURL

});

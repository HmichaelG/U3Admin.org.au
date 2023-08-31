/*!
* Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

});

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
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        sendData();
    });

    // Google reCaptcha setup
    grecaptcha.ready(function () {
        setCaptchaToken();
        setInterval(function () { setCaptchaToken(); }, 30 * 1000);
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

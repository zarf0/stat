<script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        charcoal: '#2C3E50',
                        slate: '#4A6572',
                        sand: '#E5DCC3',
                        linen: '#F9F5EB',
                        sage: '#A3B18A'
                    }
                }
            }
        }
    </script>

// loginAnimation.js

// Ensure DOM is fully loaded before animation runs
document.addEventListener("DOMContentLoaded", function () {
    gsap.set("#loginForm, #loginButton", {
        opacity: 0,
        y: 50,
        rotation: -15,
        scale: 0.8
    });

    gsap.to("#loginForm, #loginButton", {
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 1,
        delay: 0.5,
        stagger: 0.2,
        ease: "power3.out"
    });
});

// categoryRedirect.js

document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById("categorySelect");

    if (categorySelect) {
        categorySelect.addEventListener("change", function () {
            const selectedCategory = this.value;
            if (selectedCategory) {
                window.location.href = "/products/" + encodeURIComponent(selectedCategory);
            }
        });
    }
});




// cartActions.js

function getCSRFToken() {
    // <meta name="csrf-token" content="{{ csrf_token() }}">
    const tokenMeta = document.querySelector('meta[name="csrf-token"]');
    return tokenMeta ? tokenMeta.getAttribute('content') : '';
}

function removeFromCart(event, itemId) {
    event.preventDefault();

    fetch('/remove_from_cart/' + itemId, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken()
        }
    })
        .then(response => {
            if (response.ok) {
                document.getElementById('cart-item-' + itemId).remove();
                return response.json();
            } else {
                throw new Error('Failed to remove item from cart');
            }
        })
        .then(data => {
            const totalPriceElement = document.getElementById('total-price');
            totalPriceElement.textContent = 'Total: ₹' + data.total_price;
        })
        .catch(error => {
            console.error(error.message);
        });
}

// searchSuggestions.js

function setupSearch(inputId, suggestionsId) {
    const input = document.getElementById(inputId);
    const suggestionsDiv = document.getElementById(suggestionsId);

    if (!input || !suggestionsDiv) return;

    input.addEventListener('input', function (e) {
        const query = e.target.value.trim();

        if (query.length < 2) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        fetch(`/search_suggestions?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(suggestions => {
                if (suggestions.length === 0) {
                    suggestionsDiv.style.display = 'none';
                    return;
                }

                let hasCorrections = suggestions.some(s => s.type === 'correction');
                let htmlContent = '';

                suggestions.forEach((suggestion, index) => {
                    if (suggestion.type === 'correction') {
                        htmlContent += `
                            <div class="spell-correction">
                                <a href="/search?search=${encodeURIComponent(suggestion.query)}" 
                                   class="block text-sm">
                                    Did you mean: <strong>${suggestion.query}</strong>?
                                </a>
                            </div>
                        `;
                    } else {
                        htmlContent += `
                            <a href="${suggestion.url}" class="product-suggestion flex items-center">
                                <img src="${suggestion.image}" alt="${suggestion.name}" 
                                     class="w-8 h-8 rounded-md object-cover mr-3">
                                <span class="text-sm text-gray-700">${suggestion.name}</span>
                            </a>
                        `;
                    }

                    if (hasCorrections && index === 0) {
                        htmlContent += `<div class="suggestion-divider"></div>`;
                    }
                });

                suggestionsDiv.innerHTML = htmlContent;
                suggestionsDiv.style.display = 'block';
            });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
            suggestionsDiv.style.display = 'none';
        }
    });

    input.addEventListener('keydown', (e) => {
        const suggestions = suggestionsDiv.querySelectorAll('a');
        if (!suggestions.length) return;

        const focused = document.activeElement;
        let index = Array.from(suggestions).indexOf(focused);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = index < suggestions.length - 1 ? index + 1 : 0;
                suggestions[nextIndex].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = index > 0 ? index - 1 : suggestions.length - 1;
                suggestions[prevIndex].focus();
                break;
            case 'Enter':
                if (document.activeElement === input) {
                    document.getElementById(input.form.id).submit();
                }
                break;
        }
    });
}

// Initialize after DOM load
document.addEventListener("DOMContentLoaded", function () {
    setupSearch('searchInput', 'searchSuggestions');
    setupSearch('mobileSearchInput', 'mobileSearchSuggestions');
});

/**CART.HTML */

// -------------------- 1. GSAP Animations --------------------
document.addEventListener("DOMContentLoaded", function () {
    if (window.gsap) {
        gsap.set("#loginForm, #loginButton", { opacity: 0, y: 50, rotation: -15, scale: 0.8 });

        gsap.to("#loginForm, #loginButton", {
            opacity: 1,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 1,
            delay: 0.5,
            stagger: 0.2,
            ease: "power3.out"
        });
    }
});

// -------------------- 2. Category Change Redirect --------------------
document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById("categorySelect");
    if (categorySelect) {
        categorySelect.addEventListener("change", function () {
            const selectedCategory = this.value;
            if (selectedCategory) {
                window.location.href = "/products/" + encodeURIComponent(selectedCategory);
            }
        });
    }
});

// -------------------- 3. Cart Operations --------------------
function updateCart(event, itemId) {
    event.preventDefault();
    const form = document.getElementById('update-form-' + itemId);
    const formData = new FormData(form);
    fetch('/update_cart/' + itemId, {
        method: 'POST',
        headers: {
            'X-CSRFToken': window.csrf_token || ''
        },
        body: formData
    })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                throw new Error('Failed to update cart');
            }
        })
        .catch(error => {
            console.error(error.message);
        });
}

function removeFromCart(event, itemId) {
    event.preventDefault();
    fetch('/remove_from_cart/' + itemId, {
        method: 'POST',
        headers: {
            'X-CSRFToken': window.csrf_token || ''
        }
    })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                throw new Error('Failed to remove item from cart');
            }
        })
        .catch(error => {
            console.error(error.message);
        });
}

// -------------------- 4. Coupon Logic --------------------
function showCouponList() {
    fetch('/get_applicable_coupons')
        .then(response => response.json())
        .then(coupons => {
            const couponList = document.getElementById('coupon-list');
            couponList.innerHTML = '';

            const applicableCoupons = coupons.filter(c => c.applicable);
            const suggestedCoupons = coupons.filter(c => !c.applicable);

            if (applicableCoupons.length === 0 && suggestedCoupons.length === 0) {
                couponList.innerHTML = `
                    <div class="text-gray-500 text-center py-4">
                        No coupons available at this time
                    </div>
                `;
                return;
            }

            // Render applicable coupons
            if (applicableCoupons.length > 0) {
                const applicableSection = document.createElement('div');
                applicableSection.innerHTML = `
                    <h4 class="font-medium text-gray-700 mb-3">Applicable Coupons</h4>
                    <div class="space-y-3">
                        ${applicableCoupons.map(coupon => `
                            <div class="border rounded-md p-4">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h4 class="font-semibold text-lg">${coupon.code}</h4>
                                        <p class="text-gray-600 text-sm">${coupon.description}</p>
                                        <div class="mt-2 text-sm">
                                            <span class="bg-green-100 text-green-800 px-2 py-1 rounded">
                                                ${coupon.discount_type === 'flat' ?
                        `₹${coupon.discount_value} off` :
                        `${coupon.discount_value}% off`}
                                            </span>
                                            ${coupon.minimum_order_amount > 0 ?
                        `<div class="mt-1">Min. order: ₹${coupon.minimum_order_amount}</div>` : ''}
                                        </div>
                                    </div>
                                    <button onclick="applyCouponCode('${coupon.code}')" 
                                            class="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">
                                        Select
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                couponList.appendChild(applicableSection);
            }

            // Render suggested coupons
            if (suggestedCoupons.length > 0) {
                const suggestedSection = document.createElement('div');
                suggestedSection.className = 'mt-6';
                suggestedSection.innerHTML = `
                    <h4 class="font-medium text-gray-700 mb-3">Unlock More Savings</h4>
                    <div class="space-y-3">
                        ${suggestedCoupons.map(coupon => `
                            <div class="suggestion-card border rounded-md p-4 bg-gray-50">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <h4 class="font-semibold text-lg">${coupon.code}</h4>
                                        <p class="text-gray-600 text-sm">${coupon.description}</p>
                                        <div class="mt-2 text-sm space-y-1">
                                            ${coupon.suggestion_message ? `
                                            <div class="text-blue-600 font-medium">
                                                <i class="fas fa-lightbulb mr-2"></i>
                                                ${coupon.suggestion_message}
                                            </div>
                                            ` : ''}
                                            
                                            <div class="text-gray-600">
                                                ${coupon.discount_type === 'flat' ?
                        `Get ₹${coupon.discount_value} off` :
                        `Get ${coupon.discount_value}% off`}
                                                
                                                ${coupon.minimum_order_amount > 0 ?
                        `<div class="mt-1">Min. order: ₹${coupon.minimum_order_amount}</div>` : ''}
                                            </div>
                                            
                                            ${coupon.products_needed && coupon.products_needed.length > 0 ? `
                                            <div class="mt-2 flex flex-wrap gap-2">
                                                ${coupon.products_needed.slice(0, 2).map(product => `
                                                    <a href="/products/${product.category}" 
                                                       class="product-pill">
                                                        ${product.name}
                                                    </a>
                                                `).join('')}
                                            </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                    ${coupon.products_needed && coupon.products_needed.length > 0 ? `
                                    <div class="text-right">
                                        <a href="/products/${coupon.products_needed[0].category}" 
                                           class="px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">
                                            View Products
                                        </a>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                couponList.appendChild(suggestedSection);
            }
        });

    document.getElementById('coupon-modal').classList.remove('hidden');
}

function hideCouponList() {
    document.getElementById('coupon-modal').classList.add('hidden');
}

function applyCouponCode(code) {
    document.getElementById('coupon-input').value = code;
    hideCouponList();
    applyCoupon();
}

function applyCoupon(event) {
    if (event) event.preventDefault();
    const code = document.getElementById('coupon-input').value;
    const messageEl = document.getElementById('coupon-message');
    messageEl.textContent = '';

    fetch('/apply_coupon', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': window.csrf_token || ''
        },
        body: JSON.stringify({ coupon_code: code })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.reload();
            } else {
                messageEl.textContent = data.error;
            }
        });
}

function removeCoupon() {
    fetch('/remove_coupon', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': window.csrf_token || ''
        }
    }).then(() => window.location.reload());
}

//Checkout.html-modalControl.js

function openModal() {
    const modal = document.getElementById('addressModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    const modal = document.getElementById('addressModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// favorites.html

function removeFromFavorites(itemId) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $.ajax({
        type: "POST",
        url: "/remove_from_favorites/" + itemId,
        headers: {
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        success: function (response) {
            alert(response.message);
            document.querySelector('[data-item-id="' + itemId + '"]').remove();
        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON && xhr.responseJSON.error) {
                alert(xhr.responseJSON.error);
            } else {
                alert('An error occurred. Please try again.');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.remove-icon').forEach(function (icon) {
        icon.addEventListener('click', function () {
            const itemId = this.getAttribute('data-item-id');
            removeFromFavorites(itemId);
        });
    });
});

// copyCoupon - index.html

function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        alert('Coupon code copied: ' + code);

    }).catch(err => {
        console.error('Failed to copy code:', err);
    });
}

// countdownTimer.js

$(document).ready(function () {
    $('[data-countdown]').each(function () {
        var $this = $(this),
            finalDate = $this.data('countdown');

        $this.countdown(finalDate, function (event) {
            var format = '%H:%M:%S';

            if (event.offset.days > 0) {
                format = '%-d day%!d ' + format;
            }

            if (event.offset.weeks > 0) {
                format = '%-w week%!w ' + format;
            }

            $this.html(event.strftime(format));
        });
    });
});

// refundToggle.js order_detail.html

function toggleRefundForm() {
    const form = document.getElementById('refund-form');
    if (form) {
        form.classList.toggle('hidden');
    }
}

// viewModeToggle.js - product_list.html

function changeViewMode(mode) {
    const params = new URLSearchParams(window.location.search);
    params.set('view_mode', mode);
    window.location.href = "/products?" + params.toString();
}

// productFilters.js

function applyFilters() {
    let params = new URLSearchParams(window.location.search);
    let sortBy = document.getElementById("sort-select").value;
    let show = document.getElementById("show-select").value;
    let viewMode = params.get('view_mode') || "grid";
    let category = params.get('category') || "";
    let price = document.querySelector('input[name="price_filter"]:checked')?.value || "";

    params.set('sort_by', sortBy);
    params.set('show', show);
    params.set('view_mode', viewMode);
    if (category) params.set('category', category);
    if (price) params.set('price', price);

    window.location.href = "/products?" + params.toString();
}

// priceSlider.js

$(document).ready(function () {
    // Initialize the price range slider
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 10000,
        values: [
            parseInt($("#min_price").val()) || 100,
            parseInt($("#max_price").val()) || 5000
        ],
        slide: function (event, ui) {
            let priceText = ui.values[0] + " - " + ui.values[1];
            $("#amount").val(priceText);
            $("#min_price").val(ui.values[0]);
            $("#max_price").val(ui.values[1]);
        }
    });

    // Ensure correct values before submitting
    $("#price-filter-form").submit(function () {
        let values = $("#slider-range").slider("values");
        let priceText = values[0] + " - " + values[1];
        $("#amount").val(priceText);
        $("#min_price").val(values[0]);
        $("#max_price").val(values[1]);
    });
});

// profile.html

// Chart.js initialization for purchase history
document.addEventListener('DOMContentLoaded', function () {
    // Check if the purchase chart element exists
    const chartElement = document.getElementById('purchaseChart');
    if (!chartElement) return;

    // Get the labels and data from the template (these would be passed from your backend)
    const purchaseLabels = JSON.parse(chartElement.getAttribute('data-labels') || '[]');
    const purchaseData = JSON.parse(chartElement.getAttribute('data-values') || '[]');

    if (purchaseLabels.length === 0 || purchaseData.length === 0) return;

    const ctx = chartElement.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: purchaseLabels,
            datasets: [{
                label: 'Monthly Spending (₹)',
                data: purchaseData,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.05)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#fff',
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function (value) {
                            return '₹' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return 'Spent: ₹' + context.parsed.y;
                        }
                    }
                }
            }
        }
    });
});

// search_result.html
// searchSuggestions.js

function displaySuggestions(suggestions) {
    const container = document.getElementById('searchSuggestions');
    container.innerHTML = '';

    suggestions.forEach(item => {
        if (item.type === 'correction') {
            const div = document.createElement('div');
            div.className = 'correction-suggestion';
            div.innerHTML = `
                <a href="/search?search=${encodeURIComponent(item.query)}">
                    ${item.text}
                </a>
            `;
            container.appendChild(div);
        } else {
            // Existing product suggestion handling can go here if needed
        }
    });
}


 

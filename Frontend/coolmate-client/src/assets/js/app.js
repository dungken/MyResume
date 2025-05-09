/* ///////////////// SCROLL CHANGE HEADER /////////////////  */
window.addEventListener('scroll', () => {
    const siteHeader = document.querySelector('.site-header')
    const showSumaryProduct = document.querySelector('.wp-show-summary-product')

    if(window.scrollY > 100) {
        siteHeader.style.display = 'none'
        showSumaryProduct.classList.remove('d-none')

            if(window.scrollY > 1400) {
                showSumaryProduct.style.position = 'fixed'
            }

    } else {
        siteHeader.style.display = 'block'
        showSumaryProduct.classList.add('d-none')
    }
})

/* ///////////////// SCROLL FIX TABLE OF CONTENT /////////////////  */
window.addEventListener('scroll', () => {
    const tableOfContent = document.querySelector('.table-of-content')

    if(window.scrollY > 400 && window.scrollY < 17000) {
        console.log(window.scrollY);
        tableOfContent.classList.add('active')
    }else {
        tableOfContent.classList.remove('active')
    }
})

/* ///////////////// EXPAND DETAIL PRODUCT /////////////////  */
const expandDetailProduct = () => {
        
    const wpBtnExpandDetail = document.querySelector('.btn-expand-detail')
    const btnExpandDetail = document.querySelector('.expand-detail')
    const descDetail = document.querySelector('.desc-detail')

    btnExpandDetail.addEventListener('click', () => {
        if(btnExpandDetail.innerText === 'Xem thêm') {
            btnExpandDetail.innerText = 'Thu gọn'
            wpBtnExpandDetail.style.backgroundImage = 'none'
            descDetail.style.height = 'auto'
        } else {
            btnExpandDetail.innerText = 'Xem thêm'
            wpBtnExpandDetail.style.backgroundImage = 'linear-gradient(transparent,#ffffff)'
            descDetail.style.height = '900px'
        }
    })
}

/* ///////////////// SLIDE SHOW BANNER /////////////////  */

const slideShowBanner = () => {
        
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        let i;
        let slides = document.getElementsByClassName("slide-banner")
        let dots = document.getElementsByClassName("dot")
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none" 
        }
        slideIndex++
        if (slideIndex > slides.length) {
            slideIndex = 1
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "")
        }
        slides[slideIndex - 1].style.display = "block"
        dots[slideIndex - 1].className += " active"
        setTimeout(showSlides, 5000);
    }
}
slideShowBanner()

/* ///////////////// RENDER PRODUCT /////////////////  */

const productBestSeller = document.getElementById('product-best-seller');
const newProduct = document.getElementById('new-product');
const productWrapper = document.getElementById('wrapper-product');

const renderProductBestSeller = () => {
    const dataProduct = [
        {
            thumb: 'jeans-copper-denim.png',
            title: 'Jeans Copper Denim Straight',
            desc: 'Xanh Garment',
            newPrice: '599.000đ',
            oldPrice: '519.000đ',
            percentDiscount: '-13%'
        },
        {
            thumb: 'jeans-copper-denim-og.png',
            title: 'Jeans Copper Denim OG Slim',
            desc: 'Xanh Garment',
            newPrice: '599.000đ',
            oldPrice: '519.000đ',
            percentDiscount: '-13%'
        },
        {
            thumb: 'jeans-copper-denim-slim.png',
            title: 'Jeans Copper Denim Slim Fit',
            desc: 'Xanh Garment',
            newPrice: '599.000đ',
            oldPrice: '519.000đ',
            percentDiscount: '-13%'
        },
        {
            thumb: 't-shirt-phoi-jeans.png',
            title: 'T-Shirt phối Jeans',
            desc: 'Xanh Garment',
            newPrice: '599.000đ',
            oldPrice: '519.000đ',
            percentDiscount: '-13%'
        },
        {
            thumb: 'jeans-copper-denim-og.png',
            title: 'Jeans Copper Denim OG Slim',
            desc: 'Xanh Garment',
            newPrice: '599.000đ',
            oldPrice: '519.000đ',
            percentDiscount: '-13%'
        },
    ]
    let htmlProductRender = dataProduct.map((productItem) => {
        return `
            <li class="product-card">
                <div class="product-image">
                    <a href="product-details.html">
                        <img src="public/images/${productItem.thumb}" alt=""
                            class="product-thumb" data-src="public/images/demo-product-2.jpg">
                    </a>
                    <div class="quickly-add-cart">
                        <p>Thêm nhanh vào giỏ hàng +</p>
                        <ul class="list-size d-flex d-flex">
                            <li class="size-item">
                                <a href="">M</a>
                            </li>
                            <li class="size-item">
                                <a href="">L</a>
                            </li>
                            <li class="size-item">
                                <a href="">XL</a>
                            </li>
                            <li class="size-item">
                                <a href="">2XL</a>
                            </li>
                            <li class="size-item">
                                <a href="">3XL</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-types d-flex">
                        <img src="public/images/product-type-1.jpg" alt="">
                        <img src="public/images/product-type-2.jpg" alt="">
                        <img src="public/images/product-type-3.jpg" alt="">
                        <img src="public/images/product-type-4.jpg" alt="">
                    </div>
                    <a class="product-title" href="">${productItem.title}</a>
                    <p>
                        <span class="short-desc">${productItem.desc}</span>
                    </p>
                    <p>
                        <span class="price-new">${productItem.newPrice}</span>
                        <del class="price-old">${productItem.oldPrice}</del>
                        <span class="percent-discount">${productItem.percentDiscount}</span>
                    </p>
                </div>
            </li>
        `;
    })

    productWrapper.innerHTML = htmlProductRender.join('')
    productBestSeller.style.color = '#000'
    newProduct.style.color = '#b7b1b1'
}

const renderNewProduct = () => {
    let htmlProductRender = `
    <li class="product-card">
    <div class="product-image">
        <a href="product-details.html">
            <img src="public/images/thumbnail-product-demo-1.png" alt=""
                class="product-thumb" data-src="public/images/demo-product-2.jpg">
        </a>
        <div class="quickly-add-cart">
            <p>Thêm nhanh vào giỏ hàng +</p>
            <ul class="list-size d-flex d-flex">
                <li class="size-item">
                    <a href="">M</a>
                </li>
                <li class="size-item">
                    <a href="">L</a>
                </li>
                <li class="size-item">
                    <a href="">XL</a>
                </li>
                <li class="size-item">
                    <a href="">2XL</a>
                </li>
                <li class="size-item">
                    <a href="">3XL</a>
                </li>
            </ul>
        </div>
    </div>
    <div class="product-info">
        <div class="product-types d-flex">
            <img src="public/images/product-type-1.jpg" alt="">
            <img src="public/images/product-type-2.jpg" alt="">
            <img src="public/images/product-type-3.jpg" alt="">
            <img src="public/images/product-type-4.jpg" alt="">
        </div>
        <a class="product-title" href="">Shorts thể thao promax - S1</a>
        <p>
            <span class="short-desc">Xanh Navy/Thoáng khí</span>
        </p>
        <p>
            <span class="price-new">169.000đ</span>
            <del class="price-old">189.000đ</del>
            <span class="percent-discount">-11%</span>
        </p>
    </div>
    </li>
    <li class="product-card">
    <div class="product-image">
        <a href="product-details.html">
            <img src="public/images/t-shirt-chay-bo-basic.png" alt="" class="product-thumb"
                data-src="public/images/demo-product-2.jpg">
        </a>
        <div class="quickly-add-cart">
            <p>Thêm nhanh vào giỏ hàng +</p>
            <ul class="list-size d-flex d-flex">
                <li class="size-item">
                    <a href="">M</a>
                </li>
                <li class="size-item">
                    <a href="">L</a>
                </li>
                <li class="size-item">
                    <a href="">XL</a>
                </li>
                <li class="size-item">
                    <a href="">2XL</a>
                </li>
                <li class="size-item">
                    <a href="">3XL</a>
                </li>
            </ul>
        </div>
    </div>
    <div class="product-info">
        <div class="product-types d-flex">
            <img src="public/images/product-type-1.jpg" alt="">
            <img src="public/images/product-type-2.jpg" alt="">
            <img src="public/images/product-type-3.jpg" alt="">
            <img src="public/images/product-type-4.jpg" alt="">
        </div>
        <a class="product-title" href="">Shorts thể thao promax - S1</a>
        <p>
            <span class="short-desc">Xanh Navy/Thoáng khí</span>
        </p>
        <p>
            <span class="price-new">169.000đ</span>
            <del class="price-old">189.000đ</del>
            <span class="percent-discount">-11%</span>
        </p>
    </div>
    </li>
    <li class="product-card">
    <div class="product-image">
        <a href="product-details.html">
            <img src="public/images/t-shirt-ant-man-graphic.png" alt=""
                class="product-thumb" data-src="public/images/demo-product-2.jpg">
        </a>
        <div class="quickly-add-cart">
            <p>Thêm nhanh vào giỏ hàng +</p>
            <ul class="list-size d-flex d-flex">
                <li class="size-item">
                    <a href="">M</a>
                </li>
                <li class="size-item">
                    <a href="">L</a>
                </li>
                <li class="size-item">
                    <a href="">XL</a>
                </li>
                <li class="size-item">
                    <a href="">2XL</a>
                </li>
                <li class="size-item">
                    <a href="">3XL</a>
                </li>
            </ul>
        </div>
    </div>
    <div class="product-info">
        <div class="product-types d-flex">
            <img src="public/images/product-type-1.jpg" alt="">
            <img src="public/images/product-type-2.jpg" alt="">
            <img src="public/images/product-type-3.jpg" alt="">
            <img src="public/images/product-type-4.jpg" alt="">
        </div>
        <a class="product-title" href="">Shorts thể thao promax - S1</a>
        <p>
            <span class="short-desc">Xanh Navy/Thoáng khí</span>
        </p>
        <p>
            <span class="price-new">169.000đ</span>
            <del class="price-old">189.000đ</del>
            <span class="percent-discount">-11%</span>
        </p>
    </div>
    </li>
    <li class="product-card">
    <div class="product-image">
        <a href="product-details.html">
            <img src="public/images/demo-product-1.jpg" alt="" class="product-thumb"
                data-src="public/images/demo-product-2.jpg">
        </a>
        <div class="quickly-add-cart">
            <p>Thêm nhanh vào giỏ hàng +</p>
            <ul class="list-size d-flex d-flex">
                <li class="size-item">
                    <a href="">M</a>
                </li>
                <li class="size-item">
                    <a href="">L</a>
                </li>
                <li class="size-item">
                    <a href="">XL</a>
                </li>
                <li class="size-item">
                    <a href="">2XL</a>
                </li>
                <li class="size-item">
                    <a href="">3XL</a>
                </li>
            </ul>
        </div>
    </div>
    <div class="product-info">
        <div class="product-types d-flex">
            <img src="public/images/product-type-1.jpg" alt="">
            <img src="public/images/product-type-2.jpg" alt="">
            <img src="public/images/product-type-3.jpg" alt="">
            <img src="public/images/product-type-4.jpg" alt="">
        </div>
        <a class="product-title" href="">Shorts thể thao promax - S1</a>
        <p>
            <span class="short-desc">Xanh Navy/Thoáng khí</span>
        </p>
        <p>
            <span class="price-new">169.000đ</span>
            <del class="price-old">189.000đ</del>
            <span class="percent-discount">-11%</span>
        </p>
    </div>
    </li>
    <li class="product-card">
    <div class="product-image">
        <a href="product-details">
            <img src="public/images/demo-product-2.jpg" alt="" class="product-thumb"
                data-src="public/images/demo-product-2.jpg">
        </a>
        <div class="quickly-add-cart">
            <p>Thêm nhanh vào giỏ hàng +</p>
            <ul class="list-size d-flex d-flex">
                <li class="size-item">
                    <a href="">M</a>
                </li>
                <li class="size-item">
                    <a href="">L</a>
                </li>
                <li class="size-item">
                    <a href="">XL</a>
                </li>
                <li class="size-item">
                    <a href="">2XL</a>
                </li>
                <li class="size-item">
                    <a href="">3XL</a>
                </li>
            </ul>
        </div>
    </div>
    <div class="product-info">
        <div class="product-types d-flex">
            <img src="public/images/product-type-1.jpg" alt="">
            <img src="public/images/product-type-2.jpg" alt="">
            <img src="public/images/product-type-3.jpg" alt="">
            <img src="public/images/product-type-4.jpg" alt="">
        </div>
        <a class="product-title" href="">Shorts thể thao promax - S1</a>
        <p>
            <span class="short-desc">Xanh Navy/Thoáng khí</span>
        </p>
        <p>
            <span class="price-new">169.000đ</span>
            <del class="price-old">189.000đ</del>
            <span class="percent-discount">-11%</span>
        </p>
        </div>
    </li>
        `;

    productWrapper.innerHTML = htmlProductRender
    productBestSeller.style.color = '#b7b1b1'
    newProduct.style.color = '#000'
}

/* ///////////////// CHANGE PRODUCT THUMB /////////////////  */

const imagesProduct = document.querySelectorAll('.product-image')
imagesProduct.forEach((imgProduct) => {
    let imgElement = imgProduct.getElementsByTagName('img')[0]
    let dataSrc = imgElement.getAttribute('data-src')
    let src = imgElement.getAttribute('src')

    imgProduct.addEventListener('mouseover', () => {
        imgElement.setAttribute('src', dataSrc)
    })

    imgProduct.addEventListener('mouseout', () => {
        imgElement.setAttribute('src', src)
        imgElement.setAttribute('data-src', dataSrc)
    })
})


/* ///////////////// FORM SEARCH /////////////////  */

const searchInput = document.getElementById('search')
const formExpandSearch = document.querySelector('.form-expand-search')
const displayRecentResults = document.querySelector('.display-recent-results')

const expandSearch = () => {
    formExpandSearch.style.display = 'flex'
    displayRecentResults.style.display = 'flex'
} 

const closeSearch = () => {
    formExpandSearch.style.display = 'none'
    displayRecentResults.style.display = 'none'
}


/* ///////////////// TAB RIGHT INFO ACCOUNT /////////////////  */

const buttonAccount = document.querySelector('.info-account')
const showInfoAccount = document.querySelector('.show-info-account')
const btnCloseInfoAccount = document.getElementById('close-sum-account')

buttonAccount.addEventListener('click', () => {
    showInfoAccount.classList.toggle('d-block')
})
btnCloseInfoAccount.addEventListener('click', () => {
    showInfoAccount.classList.toggle('d-none')
})







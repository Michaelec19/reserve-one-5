const links = document.querySelectorAll('.nav-link')
const sections = document.querySelectorAll('section[id]')

links.forEach(link => {
  link.addEventListener('click', function () {
    links.forEach(item => item.classList.remove('active'))
    this.classList.add('active')
  })
})

window.addEventListener('scroll', () => {
  let current = ''

  sections.forEach(section => {
    const sectionTop = section.offsetTop
    if (window.scrollY >= sectionTop - 100) {
      current = section.getAttribute('id')
    }
  })

  links.forEach(link => {
    link.classList.remove('active')
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active')
    }
  })
})

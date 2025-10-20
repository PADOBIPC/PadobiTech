export default function create_footer(){
    const footer = document.createElement('footer');

    footer.innerHTML = `
      <div class="container">© 
       <span id="year"></span> 
       <span >PADOBI PC</span> —
       <span data-i18n="footer_name">сервис будущего</span>
     </div>
    `;
    return footer;
}

export function loadFooter() {
  const footerContainer = document.getElementById('footer-container')
  if (!footerContainer) return

  footerContainer.innerHTML = `
        <footer class="text-white py-5" style="background-color: #BF2A37; border-top: 4px solid #F2BE22; font-family: 'Inter', sans-serif;">
            <div class="container">
                <div class="row g-4 justify-content-between align-items-start">

                    <div class="col-md-4 text-center text-md-start">
                        <div class="mb-3">
                            <h4 class="h5 mb-1 fw-bold" style="color: #F2BE22;">Club Deportivo LanHua</h4>
                            <p class="small text-white opacity-90 mb-2">Escuela oficial de artes marciales chinas y disciplinas tradicionales.</p>
                        </div>
                        <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
                            <div class="rounded-circle d-flex align-items-center justify-content-center"
                                style="width: 32px; height: 32px; background-color: #0D0D0D;">
                                <i class="fas fa-shield-alt small" style="color: #F2BE22;"></i>
                            </div>
                            <h3 class="h5 mb-0 fw-bold" style="color: #F2BE22;">RESERVE ONE</h3>
                        </div>
                        <p class="small text-white opacity-90 mb-0">Sistema oficial de reservas para el entrenamiento y disciplinas del club.</p>
                    </div>

                    <div class="col-md-4 text-center">
                        <h5 class="h6 mb-3 fw-bold text-uppercase" style="color: #F2BE22;">Navegación</h5>
                        <ul class="list-unstyled mb-0 small">
                            <li class="mb-2"><a href="/src/index.html" class="text-decoration-none text-white opacity-90">Inicio</a></li>
                            <li class="mb-2"><a href="/src/features/about/about.html" class="text-decoration-none text-white opacity-90">Nosotros</a></li>
                            <li class="mb-2"><a href="/src/features/landing/contact/contact.html" class="text-decoration-none text-white opacity-90">Contacto</a></li>
                            <li class="mb-2"><a href="/src/features/landing/contact/contact.html#ubicacion" class="text-decoration-none text-white opacity-90">Sedes</a></li>
                            <li class="mb-2"><a href="/src/features/auth/auth.html" class="text-decoration-none text-white opacity-90">Login</a></li>
                            <li class="mb-2"><a href="/src/features/auth/auth.html#register" class="text-decoration-none text-white opacity-90">Registro</a></li>
                        </ul>
                    </div>

                    <div class="col-md-4 text-center text-md-start">
                        <h5 class="h6 mb-3 fw-bold text-uppercase" style="color: #F2BE22;">Contacto y Horarios</h5>
                        <p class="small text-white opacity-90 mb-2"><i class="fas fa-map-marker-alt me-2" style="color: #0D0D0D;"></i> Cll 48b #78a-47 Piso 5, Valle de Aburrá, Colombia</p>
                        <p class="small text-white opacity-90 mb-2"><i class="fas fa-phone me-2" style="color: #F29B30;"></i> Teléfono: +57 (4) 123-4567</p>
                        <p class="small text-white opacity-90 mb-2"><i class="fas fa-envelope me-2" style="color: #0D0D0D;"></i> Correo: lanhuaclubdeportivo@gmail.com</p>
                        <p class="small text-white opacity-90 mb-3"><i class="fas fa-clock me-2" style="color: #F29B30;"></i> Lunes a Viernes de 7:00 a.m. - 9:00 p.m. Sábados de 8:30 a.m. - 1:00 p.m.</p>
                        <div class="d-flex justify-content-center justify-content-md-start gap-3 fs-5">
                            <a href="https://www.instagram.com/lanhuaclub/?hl=es" target="_blank" class="text-white opacity-90"><i class="fab fa-instagram"></i></a>
                            <a href="https://www.facebook.com/lanhuaclub/" target="_blank" class="text-white opacity-90"><i class="fab fa-facebook"></i></a>
                            <a href="https://www.tiktok.com/@lanhuawushuclub?_r=1&_t=ZS-95GLCs2bcFY" target="_blank" class="text-white opacity-90"><i class="fab fa-tiktok"></i></a>
                            <a href="https://api.whatsapp.com/send/?phone=573136816166&text=%C2%A1Hola%21%20Quisiera%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20Club%20Deportivo%20Lan%20Hua.&type=phone_number&app_absent=0" target="_blank" class="text-white opacity-90"><i class="fab fa-whatsapp"></i></a>
                        </div>
                    </div>

                </div>

                <div class="row mt-4 pt-3 border-top border-light border-opacity-25 text-center text-white opacity-90">
                    <div class="col">
                        <p class="mb-0 small">&copy; 2026 Club Deportivo LanHua - NextGen Developers. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>
        </footer>
    `
}

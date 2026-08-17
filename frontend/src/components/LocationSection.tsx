import { MapPin, Clock } from 'lucide-react';

export default function LocationSection() {
  return (
    <section id="sobre" className="section-muted">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="heading-section mb-5">Venha nos visitar</h2>
            <p className="text-muted mb-10 text-base">
              O Centro Público Comercial Geraldo Machado é o coração comercial de Maracanaú.
              Com dezenas de lojas, boxes e barracas, oferecemos moda, beleza e alimentação
              com o melhor preço e atendimento personalizado da região.
            </p>

            <div className="space-y-4 mb-10">
              <div className="info-box">
                <div className="info-box-icon">
                  <MapPin className="w-5 h-5 text-navy" />
                </div>
                <div>
                  <p className="font-semibold text-text mb-1">Endereço</p>
                  <p className="text-muted">
                    Av. Contorno Norte, s/n - Centro, Maracanaú - CE, 61900-000
                  </p>
                </div>
              </div>

              <div className="info-box">
                <div className="info-box-icon">
                  <Clock className="w-5 h-5 text-navy" />
                </div>
                <div>
                  <p className="font-semibold text-text mb-1">Horário de Funcionamento</p>
                  <p className="text-muted">Segunda a Sábado: 7h às 18h</p>
                  <p className="text-muted">Domingo: 7h às 13h</p>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Centro+Público+Comercial+Geraldo+Machado+Maracanaú"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-navy"
            >
              Ver mapa no Google
            </a>
          </div>

          <div className="overflow-hidden h-80 lg:h-[28rem] shadow-lg ring-1 ring-border/60 card">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
              alt="Centro Público Comercial Geraldo Machado"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

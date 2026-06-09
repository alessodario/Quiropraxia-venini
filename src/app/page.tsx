"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showModalDolor, setShowModalDolor] = useState(false);
  const [showModalIntegral, setShowModalIntegral] = useState(false);
  const [showModalAtencion, setShowModalAtencion] = useState(false);

  return (
    <>
      <div className="animate-fade-in">
        {/* Hero Section */}
        <section style={{ 
        position: "relative", 
        height: "80vh", 
        minHeight: "600px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
          <Image 
            src="/hero.jpg" 
            alt="Consultorio Quiropráctico" 
            fill 
            style={{ objectFit: "cover", filter: "brightness(0.7)" }} 
            priority
          />
        </div>
        
        <div className="container" style={{ textAlign: "center" }}>
        </div>
      </section>


      {/* Services/Info Section */}
      <section className="container" style={{ padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2.5rem" }}>¿Por qué elegir la quiropraxia?</h2>
          <p style={{ maxWidth: "600px", margin: "0 auto", color: "var(--color-text-muted)" }}>
            La quiropraxia se centra en el diagnóstico y tratamiento de los trastornos mecánicos del sistema musculoesquelético, 
            especialmente la columna vertebral.
          </p>
        </div>
        
        <div className="grid grid-cols-3">
          <div className="glass-card" onClick={() => setShowModal(true)} style={{ textAlign: "center", position: "relative", overflow: "hidden", color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.8)", border: "none", background: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", cursor: "pointer", transition: "transform 0.2s ease" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
              <Image src="/alineacion.jpg" alt="Alineación Vertebral" fill style={{ objectFit: "cover", filter: "brightness(0.5)" }} />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ position: "relative", width: "100%", height: "80px", marginBottom: "1rem", borderRadius: "8px", overflow: "hidden", backgroundColor: "rgba(255, 255, 255, 0.85)" }}>
                <Image src="/columna.jpg" alt="Regiones de la Columna Vertebral" fill style={{ objectFit: "contain", padding: "4px" }} />
              </div>
              <h3 style={{ color: "#ffffff", fontWeight: 600 }}>Alineación Vertebral</h3>
              <p style={{ color: "#f8f9fa" }}>Corrige subluxaciones que interfieren con la función nerviosa y causan dolor.</p>
            </div>
          </div>
          <div className="glass-card" onClick={() => setShowModalDolor(true)} style={{ textAlign: "center", position: "relative", overflow: "hidden", color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.8)", border: "none", background: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", cursor: "pointer", transition: "transform 0.2s ease" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
              <Image src="/alivio.jpg" alt="Alivio del Dolor" fill style={{ objectFit: "cover", filter: "brightness(0.5)" }} />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚡</div>
              <h3 style={{ color: "#ffffff", fontWeight: 600 }}>Alivio del Dolor</h3>
              <p style={{ color: "#f8f9fa" }}>Tratamiento efectivo para dolores de espalda, cuello, ciática y dolores de cabeza.</p>
            </div>
          </div>
          <div className="glass-card" onClick={() => setShowModalIntegral(true)} style={{ textAlign: "center", position: "relative", overflow: "hidden", color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.8)", border: "none", background: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", cursor: "pointer", transition: "transform 0.2s ease" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
              <Image src="/salud_integral.png" alt="Salud Integral" fill style={{ objectFit: "cover", filter: "brightness(0.5)" }} />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌿</div>
              <h3 style={{ color: "#ffffff", fontWeight: 600 }}>Salud Integral</h3>
              <p style={{ color: "#f8f9fa" }}>Mejora tu postura, flexibilidad y bienestar general de manera natural.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ backgroundColor: "rgba(255,255,255,0.5)", padding: "5rem 0" }}>
        <div className="container grid grid-cols-2" style={{ alignItems: "center" }}>
          <div style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>Sobre Roberto Venini</h2>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem", lineHeight: 1.6 }}>
              Con más de 35 años de experiencia en el alivio de dolores, Roberto es un especialista dedicado a brindar una atención integral y personalizada a sus pacientes en San Carlos de Bariloche. Su enfoque único combina su amplia experiencia en quiropraxia China, Griega, Americana y Europea, junto con especializaciones en osteopatía.
            </p>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem", lineHeight: 1.6 }}>
              Además, cuenta con un Máster en Cadenas Miofasciales, conocimientos avanzados en Medicina Tradicional China y un Máster en el método Tung. Su visión holística del bienestar se complementa con su vasta trayectoria como profesor de Hatha Yoga, Ayur Yoga, Ashtanga Yoga y Yoga Chikitsa.
            </p>
            <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
              Días de atención: Lunes, Martes y Viernes. Turnos de 1 hora para asegurar la máxima calidad 
              de atención para cada paciente.
            </p>
            <Link href="/agendar" className="btn btn-outline">
              Ver horarios disponibles
            </Link>
          </div>
          <div className="glass-panel" onClick={() => setShowModalAtencion(true)} style={{ height: "400px", borderRadius: "16px", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", cursor: "pointer", transition: "transform 0.2s ease" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
              <Image src="/atencion_personalizada.jpg" alt="Atención Personalizada - Roberto Venini" fill style={{ objectFit: "cover" }} quality={100} unoptimized />
            </div>
            <h3 style={{ color: "white", fontSize: "2rem", zIndex: 1, textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 2px 20px rgba(0,0,0,0.6)" }}>Atención Personalizada</h3>
          </div>
        </div>
      </section>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div className="glass-card modal-animate" style={{ backgroundColor: "white", color: "var(--color-text-main)", maxWidth: "800px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "2rem", borderRadius: "16px", position: "relative", textAlign: "left" }}>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--color-text-muted)" }}>✖</button>
            <h2 style={{ color: "var(--color-primary-dark)", marginBottom: "1rem" }}>Alineación Vertebral y Tratamientos</h2>
            <p style={{ marginBottom: "1rem", fontSize: "1.05rem", lineHeight: 1.6 }}>La quiropráctica trata principalmente subluxaciones y disfunciones de la columna mediante ajustes manuales para mejorar la movilidad y reducir el dolor. Las afecciones comunes incluyen hernias discales, ciática, dolor lumbar/cervical, escoliosis, dolor de cabeza y latigazo cervical. Estos métodos reducen la inflamación y la presión nerviosa, mejorando la función del sistema musculoesquelético.</p>
            
            <h3 style={{ color: "var(--color-primary)", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Dolencias y Enfermedades de la Columna Tratables</h3>
            <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem", lineHeight: 1.6 }}>
              <li><strong>Dolor Lumbar (espalda baja):</strong> Tratamiento de dolor crónico y subagudo.</li>
              <li><strong>Dolor Cervical (cuello):</strong> Alivio de la tensión y dolor crónico.</li>
              <li><strong>Hernias de Disco y Discopatías:</strong> Técnicas para reducir la presión sobre los nervios.</li>
              <li><strong>Ciática:</strong> Tratamiento de la compresión del nervio ciático.</li>
              <li><strong>Escoliosis:</strong> Mejora de la alineación y función de la columna.</li>
              <li><strong>Latigazo Cervical (Whiplash):</strong> Afección común tras accidentes de tránsito.</li>
              <li><strong>Subluxaciones Vertebrales:</strong> Desalineaciones que causan interferencia nerviosa.</li>
              <li><strong>Osteoartritis/Artrosis:</strong> Mejora de la movilidad en articulaciones de la columna.</li>
            </ul>

            <h3 style={{ color: "var(--color-primary)", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Otras Dolencias Asociadas que Tratan los Quiroprácticos</h3>
            <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem", lineHeight: 1.6 }}>
              <li><strong>Dolores de Cabeza y Migrañas:</strong> Causados por desalineaciones cervicales.</li>
              <li><strong>Síndrome del Túnel Carpiano:</strong> Alivio de los síntomas mediante ajustes.</li>
              <li><strong>Dolor Articular:</strong> Problemas en hombros, caderas, rodillas y muñecas.</li>
              <li><strong>Fibromialgia y Neuralgias:</strong> Reducción del dolor musculoesquelético.</li>
              <li><strong>Tensión Muscular y Espasmos:</strong> Mejora de la función nerviosa para relajar los músculos.</li>
            </ul>

            <h3 style={{ color: "var(--color-primary)", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Beneficios de la Quiropráctica</h3>
            <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              <li><strong>Mejora de la Movilidad:</strong> Facilita el movimiento de la columna y el cuerpo.</li>
              <li><strong>Reducción de Dolor e Inflamación:</strong> Reduce la necesidad de medicamentos.</li>
              <li><strong>Mejor Calidad de Vida:</strong> Mejora el sueño y reduce el estrés.</li>
              <li><strong>Postura:</strong> Corrección de desequilibrios posturales.</li>
            </ul>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button onClick={() => setShowModal(false)} className="btn btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "1.1rem", border: "none", cursor: "pointer", borderRadius: "8px", backgroundColor: "var(--color-primary)", color: "white" }}>Volver a la pantalla anterior</button>
            </div>
          </div>
        </div>
      )}

      {showModalDolor && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div className="glass-card modal-animate" style={{ backgroundColor: "white", color: "var(--color-text-main)", maxWidth: "800px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "2rem", borderRadius: "16px", position: "relative", textAlign: "left" }}>
            <button onClick={() => setShowModalDolor(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--color-text-muted)" }}>✖</button>
            <h2 style={{ color: "var(--color-primary-dark)", marginBottom: "1rem" }}>Alivio del Dolor: Nuestro Enfoque</h2>
            
            <p style={{ marginBottom: "1rem", fontSize: "1.05rem", lineHeight: 1.6 }}>El tratamiento que te ofrezco consiste en una disciplina terapéutica manual enfocada en optimizar la salud de tus movimientos sin recurrir a fármacos ni cirugías. Nos centramos en la maravillosa plasticidad funcional del cuerpo y en su capacidad natural de recuperación.</p>
            
            <p style={{ marginBottom: "1rem", fontSize: "1.05rem", lineHeight: 1.6 }}>Es un abordaje terapéutico integral que ve cualquier disfunción estructural como una función recuperable, ya sea en tus huesos, músculos, ligamentos o tejido fascial.</p>
            
            <p style={{ marginBottom: "1.5rem", fontSize: "1.05rem", lineHeight: 1.6 }}>A través de un diagnóstico funcional preciso y un tratamiento dedicado, te ayudamos a recuperar tu movilidad natural y a aliviar de raíz aquellos dolores provocados por el mal funcionamiento de cualquier segmento corporal.</p>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button onClick={() => setShowModalDolor(false)} className="btn btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "1.1rem", border: "none", cursor: "pointer", borderRadius: "8px", backgroundColor: "var(--color-primary)", color: "white" }}>Volver a la pantalla anterior</button>
            </div>
          </div>
        </div>
      )}

      {showModalIntegral && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div className="glass-card modal-animate" style={{ backgroundColor: "white", color: "var(--color-text-main)", maxWidth: "800px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "2rem", borderRadius: "16px", position: "relative", textAlign: "left" }}>
            <button onClick={() => setShowModalIntegral(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--color-text-muted)" }}>✖</button>
            <h2 style={{ color: "var(--color-primary-dark)", marginBottom: "1rem" }}>Salud Integral: Un Método Único</h2>
            
            <p style={{ marginBottom: "1rem", fontSize: "1.05rem", lineHeight: 1.6 }}>El enfoque de Salud Integral que aplico se basa en un método propio de diagnóstico y tratamiento, fundamentado en la Osteopatía, las cadenas musculares y la profunda combinación de las Quiropraxias Americana, China y Griega.</p>
            
            <p style={{ marginBottom: "1rem", fontSize: "1.05rem", lineHeight: 1.6 }}>Este método se centra en la reorganización funcional del cuerpo. Muchas veces, debido a un desequilibrio con la fuerza de gravedad que nos sustenta, nuestro cuerpo físico se desalinea de su eje natural (lo que podemos llamar nuestro <em>'cuerpo ancestral'</em>).</p>
            
            <p style={{ marginBottom: "1rem", fontSize: "1.05rem", lineHeight: 1.6 }}>La gravedad traza ejes invisibles en nuestra estructura, y todos nuestros movimientos ocurren en torno a ellos. Cuando perdemos esa relación armónica con la fuerza que nos atrae a la tierra, nuestra postura colapsa. Esto comienza acortando el rango de movimiento, alterando nuestra postura, generando dolor crónico y, finalmente, provocando lesiones.</p>

            <p style={{ marginBottom: "1.5rem", fontSize: "1.05rem", lineHeight: 1.6 }}>A través de intervenciones fisiológicas precisas, activamos los procesos naturales de sanación. El objetivo es que ese <em>'cuerpo del dolor'</em> vuelva a acercarse a su forma funcional óptima: el estado natural, armónico y equilibrado que nos pertenece por herencia biológica, permitiéndote recuperar tu verdadera vitalidad y bienestar.</p>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button onClick={() => setShowModalIntegral(false)} className="btn btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "1.1rem", border: "none", cursor: "pointer", borderRadius: "8px", backgroundColor: "var(--color-primary)", color: "white" }}>Volver a la pantalla anterior</button>
            </div>
          </div>
        </div>
      )}

      {showModalAtencion && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div className="glass-card modal-animate" style={{ backgroundColor: "white", color: "var(--color-text-main)", maxWidth: "800px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "2rem", borderRadius: "16px", position: "relative", textAlign: "left" }}>
            <button onClick={() => setShowModalAtencion(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--color-text-muted)" }}>✖</button>
            <h2 style={{ color: "var(--color-primary-dark)", marginBottom: "1.5rem" }}>Atención Personalizada</h2>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }}>🏃‍♂️ Deportista:</h3>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.6 }}>"En el alto rendimiento, la simetría es potencia. Si tu cadena muscular está desalineada, estás desperdiciando energía y arriesgando una lesión. Para solucionar esto, calibramos tu eje para que el esfuerzo sea eficiente."</p>
            </div>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }}>🩹 Ya estoy lesionado:</h3>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.6 }}>"Si hay dolor, ya hay una compensación crónica. No vamos a forzar tu cuerpo; vamos a desarmar ese nudo de tensiones paso a paso para que la recuperación sea real y no un parche temporal."</p>
            </div>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }}>💻 Vida de Oficina:</h3>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.6 }}>"El sedentarismo crea una carga estática que deforma tu postura. Buscamos devolverle la movilidad a tu sistema nervioso, permitiéndote rendir en tu trabajo sin el peso del agotamiento físico."</p>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }}>🛡️ Prevención:</h3>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.6 }}>"La excelencia física se mantiene, no se recupera cuando ya falló. Un ajuste preventivo es la mejor estrategia para evitar que pequeñas desalineaciones se conviertan en problemas estructurales mañana."</p>
            </div>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button onClick={() => setShowModalAtencion(false)} className="btn btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "1.1rem", border: "none", cursor: "pointer", borderRadius: "8px", backgroundColor: "var(--color-primary)", color: "white" }}>Volver a la pantalla anterior</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

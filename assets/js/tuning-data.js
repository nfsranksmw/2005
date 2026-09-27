// =======================================================
// NFSRANKSMW - BASE DE DATOS OFICIAL DE GUÍAS Y TUNING
// Especificaciones técnicas, telemetría y configuraciones de rendimiento
// para los 10 autos emblemáticos de Rockport City
// =======================================================

const TUNING_CARS_DATA = [
    {
        id: "bmw-m3-gtr",
        name: "BMW M3 GTR E46",
        badge: "👑 BONUS CAR / ÍCONO",
        category: "bonus",
        drivetrain: "RWD",
        drivetrainLabel: "Tracción Trasera (RWD)",
        engine: "4.0L P60B40 V8 Naturalmente Aspirado",
        power: "444 HP @ 7,500 RPM",
        topSpeed: "389 km/h (Configuración Máxima)",
        acceleration: "3.2s (0-100 km/h)",
        weight: "1,120 kg (Chasis Aligerado)",
        image: "assets/img/cars/bmw-m3-gtr.jpg",
        description: "La leyenda indiscutible de Rockport City. Con su chasis de carreras tubular, suspensión rígida y una entrega de potencia lineal en su V8 de competición, el M3 GTR ofrece el paso por curva más estable y veloz de todo el juego sin necesidad de piezas ilegales.",
        trackSpecialty: "Circuitos Mixtos, Sprints Rápidos & Zonas de Curvas Enlazadas",
        tuningSetup: {
            steering: 3,         // +3 Hacia Rápida (giro reactivo)
            handling: 2,         // +2 Ligero sobreviraje para rotar en horquillas
            brakes: 1,           // +1 Sesgo delantero para frenada tardía estable
            rideHeight: -4,      // -4 Máximo centro de gravedad bajo sin rozar bordillos
            aerodynamics: 4,     // +4 Mucha carga aerodinámica para curvas de 5ta marcha
            nitrous: 2,          // +2 Potencia equilibrada para acelerar a la salida
            turboSupercharger: 4 // +4 Alta compresión en altas RPM
        },
        sliderExplanations: {
            steering: "+3 (Rápida) — Respuesta inmediata del volante al rozar los pianos.",
            handling: "+2 (Sobreviraje) — Permite rotar la cola sin perder tracción trasera.",
            brakes: "+1 (Delantero) — Evita trompos en frenadas violentas en bajada.",
            rideHeight: "-4 (Baja) — Máximo agarre aerodinámico y respuesta de chasis.",
            aerodynamics: "+4 (Alta) — Impide despegues en rasantes y da agarre en curvas rápidas.",
            nitrous: "+2 (Potencia) — Ideal para recuperar velocidad tras curvas cerradas.",
            turboSupercharger: "+4 (Altas RPM) — Aprovecha la banda superior entre 6.000 y 8.500 RPM."
        },
        proTips: "El M3 GTR no admite piezas Junkman en su configuración oficial de torneo (Categoría BMW NO NOS). Aprovecha su excepcional relación peso-potencia: frena en línea recta, entra al vértice soltando suavemente el freno y acelera a fondo en cuanto el morro apunte a la salida."
    },
    {
        id: "porsche-carrera-gt",
        name: "Porsche Carrera GT",
        badge: "💎 MONSTRUO JUNKMAN",
        category: "junkman",
        drivetrain: "RWD",
        drivetrainLabel: "Tracción Trasera (RWD)",
        engine: "5.7L V10 68° DOHC",
        power: "850+ HP (Full Junkman / NOS)",
        topSpeed: "405+ km/h",
        acceleration: "2.4s (0-100 km/h)",
        weight: "1,250 kg",
        image: "assets/img/cars/porsche-carrera-gt.jpg",
        description: "La cumbre de la velocidad punta y la fuerza bruta en Rockport. Con piezas Junkman completas, el Carrera GT es el vehículo más rápido en línea recta de todo el juego, capaz de pulverizar récords en pistas como Highway 99, North Bay y Ocean Drive.",
        trackSpecialty: "Sprints de Alta Velocidad, Autopistas Despejadas & Drag",
        tuningSetup: {
            steering: 2,
            handling: -1,        // -1 Ligero subviraje para evitar trompos por exceso de potencia
            brakes: 2,
            rideHeight: -5,      // -5 Ultrabajo para penetración aerodinámica
            aerodynamics: -2,    // -2 Baja carga para exprimir velocidad punta terminal
            nitrous: 5,          // +5 Máxima potencia de inyección de NOS
            turboSupercharger: 5 // +5 Explosión de potencia en altas RPM
        },
        sliderExplanations: {
            steering: "+2 (Rápida) — Permite corregir trayectoria a más de 380 km/h.",
            handling: "-1 (Subviraje) — Clave para que la cola no intente adelantarte al acelerar.",
            brakes: "+2 (Delantero) — Ancla el tren delantero para detener los 850 HP.",
            rideHeight: "-5 (Mínima) — Reduce al mínimo la resistencia al viento.",
            aerodynamics: "-2 (Baja Carga) — Otorga +15 km/h extra de velocidad terminal.",
            nitrous: "+5 (Máxima Potencia) — Aceleración brutal para alcanzar los 400 km/h en segundos.",
            turboSupercharger: "+5 (Altas RPM) — Saca el máximo partido en las rectas infinitas de Camden."
        },
        proTips: "Administra el pedal del acelerador en primera y segunda marcha: con piezas Junkman las ruedas traseras patinarán si aceleras al 100%. Usa el Speedbreaker únicamente para esquivar tráfico pesado a más de 350 km/h."
    },
    {
        id: "lotus-elise",
        name: "Lotus Elise 111R",
        badge: "⚡ REY DE CURVAS",
        category: "stock-restrictive",
        drivetrain: "RWD",
        drivetrainLabel: "Tracción Trasera (RWD)",
        engine: "1.8L Toyota 2ZZ-GE VVTL-i Supercargado",
        power: "360 HP (Junkman / Competición)",
        topSpeed: "345 km/h",
        acceleration: "2.8s (0-100 km/h)",
        weight: "860 kg (Pluma Absoluta)",
        image: "assets/img/cars/lotus-elise.jpg",
        description: "El coche más ágil y ligero de todo Need for Speed Most Wanted. En circuitos estrechos con chicanas y horquillas pronunciadas (Rosewood Country Club, Omega, Petersburg Dam), ningún otro vehículo puede seguir su paso por curva.",
        trackSpecialty: "Circuitos Cerrados Técnicos, Horquillas & Slaloms Urbanos",
        tuningSetup: {
            steering: 4,
            handling: 3,         // +3 Sobreviraje controlado para enlazar chicanas
            brakes: 0,           // Neutro para distribuir la frenada en las cuatro esquinas
            rideHeight: -3,
            aerodynamics: 5,     // +5 Máxima carga para pegarse al asfalto
            nitrous: -2,         // -2 Mayor duración de nitro para mantener salida sostenida
            turboSupercharger: -1// -1 Buen empuje en rango medio para salir de curvas lentas
        },
        sliderExplanations: {
            steering: "+4 (Ultra Rápida) — Cambios de dirección casi instantáneos.",
            handling: "+3 (Sobreviraje) — Permite deslizar milimétricamente en curvas lentas.",
            brakes: "0 (Equilibrado) — Los 860 kg frenan en un metro sin bloquear neumáticos.",
            rideHeight: "-3 (Baja) — Absorbe bordillos sin perder estabilidad.",
            aerodynamics: "+5 (Máxima) — Clave para tomar curvas de radio medio a fondo.",
            nitrous: "-2 (Duración) — Te mantiene en aceleración continua durante secciones largas.",
            turboSupercharger: "-1 (Medias RPM) — Respuesta inmediata al tocar el acelerador."
        },
        proTips: "No frenes de más: el Elise conserva una inercia lateral asombrosa. Entra en las curvas con más velocidad de la que crees posible; el peso pluma mantendrá la trayectoria sin desviarse ni un centímetro."
    },
    {
        id: "mitsubishi-lancer-evo",
        name: "Mitsubishi Lancer Evolution VIII",
        badge: "🔥 TRACCIÓN TOTAL AWD",
        category: "stock-restrictive",
        drivetrain: "AWD",
        drivetrainLabel: "Tracción Total (AWD)",
        engine: "2.0L 4G63T Turbo DOHC",
        power: "520 HP (Tuning Pro)",
        topSpeed: "365 km/h",
        acceleration: "2.6s (0-100 km/h)",
        weight: "1,340 kg",
        image: "assets/img/cars/mitsubishi-lancer-evo.jpg",
        description: "El arma definitiva para pilotos que exigen tracción y aceleración sin concesiones. Su sistema de tracción a las cuatro ruedas elimina casi por completo el patinaje, convirtiéndolo en el rey de las salidas y de pistas con lluvia o curvas en subida.",
        trackSpecialty: "Circuitos Urbanos de Downtown, Subidas de Montaña & Aceleraciones",
        tuningSetup: {
            steering: 3,
            handling: 4,         // +4 Contrarresta el subviraje natural de los coches AWD
            brakes: 1,
            rideHeight: -4,
            aerodynamics: 3,
            nitrous: 3,
            turboSupercharger: 2
        },
        sliderExplanations: {
            steering: "+3 (Rápida) — Ayuda a que el morro apunte rápido hacia el vértice.",
            handling: "+4 (Sobreviraje Fuerte) — Crucial para que el sistema AWD no subvire.",
            brakes: "+1 (Delantero) — Asegura frenadas firmes sin desbalancear la masa.",
            rideHeight: "-4 (Baja) — Estabilidad total al pasar por encima de raíles y desniveles.",
            aerodynamics: "+3 (Alta) — Carga suficiente sin sacrificar aceleración en recta.",
            nitrous: "+3 (Potencia) — Salida fulgurante en semáforos y horquillas.",
            turboSupercharger: "+2 (Altas RPM) — Mantiene la presión del turbo soplando al máximo."
        },
        proTips: "Usa el sobreviraje inducido: entra en la curva frenando con el volante ligeramente girado para balancear la masa; cuando la cola comience a deslizar, pisa a fondo y el sistema AWD te catapultará recto hacia adelante."
    },
    {
        id: "subaru-impreza-wrx",
        name: "Subaru Impreza WRX STI",
        badge: "⚡ DOMINIO RALLY",
        category: "stock-restrictive",
        drivetrain: "AWD",
        drivetrainLabel: "Tracción Total (AWD)",
        engine: "2.5L EJ257 Boxer Turbo 4 Cilindros",
        power: "510 HP (Tuning Pro)",
        topSpeed: "362 km/h",
        acceleration: "2.7s (0-100 km/h)",
        weight: "1,380 kg",
        image: "assets/img/cars/subaru-impreza-wrx.jpg",
        description: "Equilibrio perfecto gracias a su motor Boxer de bajo centro de gravedad y tracción integral simétrica. Excelente resistencia a los impactos con bordillos y barandillas, ideal para trazados complicados en los sectores boscosos de Rosewood y Rockport North.",
        trackSpecialty: "Trazados Revirados, Sectores con Cambios de Elevación & Asfalto Desigual",
        tuningSetup: {
            steering: 2,
            handling: 3,
            brakes: 1,
            rideHeight: -3,      // -3 Moderada para absorber saltos y desniveles
            aerodynamics: 3,
            nitrous: 1,
            turboSupercharger: 3
        },
        sliderExplanations: {
            steering: "+2 (Rápida) — Precisión de guiado con tacto progresivo.",
            handling: "+3 (Sobreviraje) — Facilita rotar el chasis en curvas lentas de 90°.",
            brakes: "+1 (Delantero) — Estabilidad impecable en frenadas sobre baches.",
            rideHeight: "-3 (Media-Baja) — Evita que el fondo plano toque el suelo en rasantes.",
            aerodynamics: "+3 (Alta) — Mantiene el agarre aerodinámico sin restar velocidad.",
            nitrous: "+1 (Equilibrado) — Buen compromiso entre tiempo de descarga y empuje.",
            turboSupercharger: "+3 (Altas RPM) — Despliega toda la fuerza del motor Boxer."
        },
        proTips: "En curvas con badenes o desniveles pronunciados, mantén el acelerador constante en lugar de soltarlo de golpe: el diferencial central mantendrá el coche perfectamente pegado a la línea ideal."
    },
    {
        id: "ford-mustang-gt",
        name: "Ford Mustang GT",
        badge: "🔥 AMERICAN MUSCLE",
        category: "stock-restrictive",
        drivetrain: "RWD",
        drivetrainLabel: "Tracción Trasera (RWD)",
        engine: "4.6L Modular 3V V8",
        power: "560 HP (Junkman / Supercargado)",
        topSpeed: "372 km/h",
        acceleration: "2.9s (0-100 km/h)",
        weight: "1,520 kg",
        image: "assets/img/cars/ford-mustang-gt.jpg",
        description: "Fuerza bruta estadounidense y par motor inagotable desde el ralentí. El Mustang GT es pesado, pero su aceleración intermedia y su velocidad de paso en curvas amplias lo convierten en un rival formidable en autopistas y sprints abiertos.",
        trackSpecialty: "Sprints Abiertos, Rectas Largas & Curvas de Radio Amplio",
        tuningSetup: {
            steering: 3,
            handling: 1,         // +1 Ligero para controlar la masa trasera sin desestabilizar
            brakes: 3,           // +3 Frenos potentes adelante para detener los 1.500 kg
            rideHeight: -4,
            aerodynamics: 2,
            nitrous: 4,          // +4 Inyección potente para salidas de curva
            turboSupercharger: 1 // +1 Buen empuje en rango bajo-medio gracias al gran torque V8
        },
        sliderExplanations: {
            steering: "+3 (Rápida) — Compensa la pesadez del morro en la entrada a curva.",
            handling: "+1 (Sobreviraje Leve) — Evita derrapes incontrolables provocados por el V8.",
            brakes: "+3 (Delantero) — Mayor mordida para detener el peso del vehículo a tiempo.",
            rideHeight: "-4 (Baja) — Reduce el balanceo de carrocería en cambios de apoyo.",
            aerodynamics: "+2 (Media) — Suficiente para estabilizar la zaga a alta velocidad.",
            nitrous: "+4 (Potencia) — Aprovecha el par motor para adelantar como un misil.",
            turboSupercharger: "+1 (Bajas RPM) — El V8 ya tiene suficiente fuerza arriba."
        },
        proTips: "Anticipa la frenada unos 10 metros antes que con un Lotus o un Evo debido al peso extra. En la salida de curva, no des volantazos: acelera progresivamente para que los neumáticos traseros muerdan el asfalto sin quemar goma."
    },
    {
        id: "chevy-cobalt-ss",
        name: "Chevrolet Cobalt SS",
        badge: "⚡ FWD AGILITY",
        category: "stock-restrictive",
        drivetrain: "FWD",
        drivetrainLabel: "Tracción Delantera (FWD)",
        engine: "2.0L Ecotec Supercargado 4L",
        power: "420 HP (Tuning Pro)",
        topSpeed: "355 km/h",
        acceleration: "3.1s (0-100 km/h)",
        weight: "1,260 kg",
        image: "assets/img/cars/chevy-cobalt-ss.jpg",
        description: "El mejor tracción delantera de Rockport. Sorprendentemente dócil y predecible, el Cobalt SS permite frenar muy tarde y acelerar sin miedo a hacer trompos. Su supercargador entrega potencia instantánea sin lag de turbo.",
        trackSpecialty: "Circuitos Urbanos Cerrados, Calles de Rosewood & Zonas de Chicanas",
        tuningSetup: {
            steering: 4,
            handling: 5,         // +5 Máximo sobreviraje para anular el subviraje FWD
            brakes: -1,          // -1 Ligero sesgo trasero para que la cola ayude a girar
            rideHeight: -4,
            aerodynamics: 4,
            nitrous: 2,
            turboSupercharger: -2// -2 Respuesta instantánea en bajas revoluciones
        },
        sliderExplanations: {
            steering: "+4 (Rápida) — Hace que las ruedas directrices y motrices reaccionen al instante.",
            handling: "+5 (Máximo Sobreviraje) — Imprescindible en FWD para no salirte de morro.",
            brakes: "-1 (Trasero) — Clavar frenos hace que la zaga se abra y coloque el coche.",
            rideHeight: "-4 (Baja) — Minimiza la transferencia de peso hacia adelante.",
            aerodynamics: "+4 (Alta) — Agarre constante para no perder tracción en apoyo.",
            nitrous: "+2 (Potencia) — Empuje equilibrado sin sobrecargar el eje delantero.",
            turboSupercharger: "-2 (Bajas RPM) — Entrega inmediata del supercargador Eaton."
        },
        proTips: "En curvas lentas, utiliza la técnica del 'trail braking' (frenar mientras entras al viraje): esto levantará peso de las ruedas traseras, permitiendo que la cola rote de forma natural. Una vez alineado, pisa a fondo sin temor."
    },
    {
        id: "fiat-punto",
        name: "Fiat Punto 1.8 HGT",
        badge: "🏎️ PESO PLUMA URBANO",
        category: "stock-restrictive",
        drivetrain: "FWD",
        drivetrainLabel: "Tracción Delantera (FWD)",
        engine: "1.8L 16V DOHC VVT Supercargado",
        power: "380 HP (Junkman / Competición)",
        topSpeed: "348 km/h",
        acceleration: "3.0s (0-100 km/h)",
        weight: "1,040 kg",
        image: "assets/img/cars/fiat-punto.jpg",
        description: "Una pequeña bala urbana que desafía a los gigantes. Su batalla corta y bajísimo peso le permiten cambiar de dirección con una velocidad asombrosa, convirtiéndolo en un especialista temible en pistas de circuito ratoneras como Industrial Layout.",
        trackSpecialty: "Circuitos Cortos Técnicos, Callejuelas de Rockport & Zonas Industriales",
        tuningSetup: {
            steering: 5,         // +5 Máxima rapidez de dirección
            handling: 4,
            brakes: -1,
            rideHeight: -3,
            aerodynamics: 4,
            nitrous: -1,         // -1 Mayor duración para compensar velocidad punta
            turboSupercharger: -1
        },
        sliderExplanations: {
            steering: "+5 (Máxima) — El volante responde al menor milímetro de giro.",
            handling: "+4 (Sobreviraje) — Facilita enlazar curvas cerradas de 90° en serie.",
            brakes: "-1 (Trasero) — Ayuda a que el eje trasero rote en frenadas fuertes.",
            rideHeight: "-3 (Baja) — Buena absorción de bordillos y vías de tren.",
            aerodynamics: "+4 (Alta) — Pega el pequeño chasis al suelo a más de 300 km/h.",
            nitrous: "-1 (Duración) — Te mantiene empujando en rectas intermedias.",
            turboSupercharger: "-1 (Medias RPM) — Buena salida sin pérdidas de tracción."
        },
        proTips: "El Punto se desenvuelve como pez en el agua en curvas de segunda y tercera marcha. No intentes pelear velocidad punta con un Carrera GT en la autopista: tu ventaja está en frenar 20 metros más tarde y salir pegado a la cuerda."
    },
    {
        id: "mazda-rx8",
        name: "Mazda RX-8",
        badge: "🌀 ROTARY BALANCE 50:50",
        category: "stock-restrictive",
        drivetrain: "RWD",
        drivetrainLabel: "Tracción Trasera (RWD)",
        engine: "1.3L 2-Rotor RENESIS Rotary Turbo",
        power: "470 HP (Tuning Pro)",
        topSpeed: "358 km/h",
        acceleration: "2.9s (0-100 km/h)",
        weight: "1,290 kg (Reparto 50:50)",
        image: "assets/img/cars/mazda-rx8.jpg",
        description: "El coche más equilibrado del juego gracias a su reparto de masas perfecto del 50% adelante y 50% atrás. Su motor rotativo puede girar hasta las 9.000 RPM con una suavidad absoluta, ofreciendo una conducción fluida y elegante en cualquier circuito.",
        trackSpecialty: "Circuitos Medios, Curvas Rápidas de Camden Beach & Enlazadas en Bajada",
        tuningSetup: {
            steering: 3,
            handling: 2,
            brakes: 1,
            rideHeight: -4,
            aerodynamics: 3,
            nitrous: 2,
            turboSupercharger: 4 // +4 Máxima potencia en la estratosfera de las 9.000 RPM
        },
        sliderExplanations: {
            steering: "+3 (Rápida) — Muy progresiva y transparente al límite.",
            handling: "+2 (Sobreviraje Leve) — Aprovecha el balance neutro del chasis 50:50.",
            brakes: "+1 (Delantero) — Frena plano sin levantar la trasera.",
            rideHeight: "-4 (Baja) — Centro de masa extremadamente bajo gracias al motor rotativo.",
            aerodynamics: "+3 (Alta) — Estabilidad total en curvas rápidas de 4ta marcha.",
            nitrous: "+2 (Potencia) — Excelente para catapultar las marchas intermedias.",
            turboSupercharger: "+4 (Altas RPM) — Sincronizado con la línea roja a 9.000 RPM."
        },
        proTips: "Mantén el motor rotativo cantando en la zona alta del cuentavueltas: nunca cambies de marcha antes de las 8.500 RPM. La suavidad del chasis te permite rozar muros sin descolocar el coche."
    },
    {
        id: "mercedes-slr-mclaren",
        name: "Mercedes-Benz SLR McLaren",
        badge: "⚡ BULL BLACKLIST #2",
        category: "junkman",
        drivetrain: "RWD",
        drivetrainLabel: "Tracción Trasera (RWD)",
        engine: "5.4L M155 Supercargado SOHC 24V V8",
        power: "820 HP (Full Junkman)",
        topSpeed: "400+ km/h",
        acceleration: "2.5s (0-100 km/h)",
        weight: "1,680 kg",
        image: "assets/img/cars/mercedes-slr-mclaren.jpg",
        description: "La máquina de guerra de Bull (#2 de la Blacklist). Con su enorme capó largo albergando el V8 sobrealimentado por compresor de McLaren y aerofreno dinámico trasero, el SLR es un misil balístico capaz de pulverizar los radares de Rockport City.",
        trackSpecialty: "Sprints de Larga Distancia, Radares de Velocidad & Drag",
        tuningSetup: {
            steering: 2,
            handling: 0,         // Neutro para controlar la pesada masa a 400 km/h
            brakes: 4,           // +4 Máxima frenada delantera para compensar los 1.680 kg
            rideHeight: -5,
            aerodynamics: 1,     // +1 Poca carga para exprimir velocidad punta terminal
            nitrous: 5,          // +5 Inyección masiva de NOS
            turboSupercharger: 3
        },
        sliderExplanations: {
            steering: "+2 (Rápida) — Evita movimientos bruscos que puedan desestabilizar la masa.",
            handling: "0 (Neutro) — Mantiene las cuatro ruedas firmes en asfalto rápido.",
            brakes: "+4 (Delantero Fuerte) — Crucial para detener la mole a más de 380 km/h.",
            rideHeight: "-5 (Mínima) — Penetración aerodinámica tipo flecha plateada.",
            aerodynamics: "+1 (Media-Baja) — Prioriza velocidad punta en autopistas.",
            nitrous: "+5 (Máxima) — Aceleración monstruosa que te pega al asiento.",
            turboSupercharger: "+3 (Altas RPM) — El compresor volumétrico empuja sin descanso."
        },
        proTips: "El aerofreno trasero del SLR se despliega automáticamente en frenadas fuertes, lo que otorga una estabilidad única en línea recta. Úsalo para adelantar al final de las rectas más largas de Rockport antes de zambullirte en la curva."
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TUNING_CARS_DATA };
}

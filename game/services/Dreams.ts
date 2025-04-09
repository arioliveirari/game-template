import { globalState } from "../GlobalDataManager";
import RPG from "../rpg";
import EventsCenterManager from "./EventsCenter";


export type DreamType = {
  id: string;
  texts: string[];
}
export class Dreams {
  private static instance: Dreams;
  public dreamPool: DreamType[] = [];
  private allPool: DreamType[] = [];
  private containerBox?: Phaser.GameObjects.Container;
  private scene?: RPG;
  private closeFunction?: Function;
  private text?: Phaser.GameObjects.Text;
  private acuText?: boolean;
  private dreamToShow?: DreamType;
  private index?: number;
  private blackScreen?: Phaser.GameObjects.Graphics;
  public makeItSecuencial: boolean = true;

  constructor() {
    this.allPool = [
      {
        id: "s1",
        texts:  [
          "Wow, fue un gran día. ¿Qué chambas trabajos te gustaron más?",
          "¿Pensaste que haremos mañana?"
        ],
      },
      { 
        id: "s2",
        texts:  [
          "¡Qué día tan agotador! Chambix está cansado. ", 
          "¿Deberíamos comprar con todo el dinero que ganamos?", 
        ],
      },
      {
        id: "s3",
        texts:[
          "¡Eres increíble! Hoy también te luciste.", 
          "¡Ha llegado la hora de elegir a tu Chambix de aventuras!", 
        ],
      },
      {
        id: "s4",
        texts:  [
          "¡Increíble jornada! ¿Qué fue lo más desafiante del trabajo de hoy?" 
        ],
      },
      {
        id: "s5",
        texts: [
          "¡Chambix está emocionado!", 
          "¿Cuál de todas las tareas crees que se te dio mejor?", 
        ],
      },
      {
        id: "s6",
        texts:  [
          "Chambix tiene una pregunta importante...", 
          "Si pudieras elegir cualquier trabajo, ¿cuál sería?", 
        ],
      },
      {
        id: "s7",
        texts:   [
          "¡Misión cumplida! ¿Cómo te sentiste manejando responsabilidades hoy?",
        ],
      },
      {
        id: "s8",
        texts:   [
          "¡Gran trabajo!", 
          "¿Qué consejo le darías a alguien que empieza en este mundo laboral?", 
        ],
      },
      {
        id: "s9",
        texts:   [
          "¡El esfuerzo tiene recompensas!", 
          "¿Cómo organizarías tus ingresos para aprovecharlos mejor?", 
        ],
      },
      {
        id: "s10",
        texts:   [
          "¡Chambix cree en ti! ", 
          "Cada desafío es una nueva oportunidad para aprender.",
          "¡Sigue adelante!" 
        ],
      },
      {
        id: "s11",
        texts:   [
          "¡Tú puedes con esto y más! El esfuerzo de hoy será el éxito de mañana.", 
        ],
      },
      {
        id: "s12",
        texts:   [
          "¡Nada te detiene y Chambix lo sabe!", 
          "Los errores son parte del proceso. Lo importante es aprender de ellos.",
          "¡No te rindas!" 
        ],
      },
      {
        id: "s13",
        texts:   [
          "¿Cuánto has avanzado? ", 
          "Mira todo lo que has conseguido desde que conociste a Chambix.", 
        ],
      },
      {
        id: "s14",
        texts:   [
          "¡Confía en tu talento! A veces lo más importante es animarse…", 
        ],
      },
      {
        id: "s15",
        texts:   [
          "¡Sigue brillando! Chambix está orgulloso de ti.", 
        ],
      },
      {
        id: "s16",
        texts:   [
          "¡Nunca dejes de aprender!", 
          "Cada día es una nueva oportunidad para crecer y mejorar.", 
        ],
      },
      {
        id: "s17",
        texts:   [
          "¡Prepárate! El mundo es tuyo y junto a Chambix seguirás en esta aventura.", 
        ],
      },
      {
        id: "s18",
        texts:   [
          "Sueña en grande…", 
          "Es importante que visualicemos a dónde nos gustaría llegar.", 
        ],
      },
      {
        id: "s19",
        texts:   [
          "¡Consejo Chambix! ", 
          "Si logras divertirte mientras trabajas habrás conseguido algo increíble.", 
        ],
      },
      {
        id: "s20",
        texts:   [
          "¡Chambix cree que el ahorro es clave! ¿Tú qué opinas?", 
        ],
      },
      {
        id: "s21",
        texts:   [
          "¡Cada esfuerzo tiene su recompensa! ¿Qué harás al despertar?", 
        ],
      },
      {
        id: "s22",
        texts:   [
          "¿Alguna vez pensaste en cómo administrar mejor tu dinero?", 
        ],
      },
      {
        id: "s23",
        texts:   [
          "El dinero bien usado puede abrir muchas puertas.", 
          "¿Se te ocurre qué podrías hacer?", 
        ],
      },
      {
        id: "s24",
        texts:   [
          "Una buena previsión hace la diferencia.", 
          "¿Qué piensas sobre el fondo de emergencia?", 
        ],
      },
      {
        id: "s25",
        texts:   [
          "¡Ganar es emocionante, pero ahorrar es inteligente!", 
        ],
      },
      {
        id: "s26",
        texts:   [
          "El trabajo constante trae estabilidad.", 
          "¡Sigue avanzando junto a Chambix y aprovecha su sabiduría!", 
        ],
      },
      {
        id: "s27",
        texts:   [
          "Piensa siempre en un equilibrio entre gastos, ahorros e inversiones.", 
        ],
      },
      {
        id: "s28",
        texts:   [
          "¡Cada moneda cuenta!", 
          "Un pequeño ahorro hoy puede ser una gran inversión mañana.", 
        ],
      },
      {
        id: "s29",
        texts:   [
          "¡Trabajaste duro para conseguir lo que tienes!", 
          "La vida también es para disfrutar.",
          "Planifica qué parte de lo que ganaste quieres usar para divertirte." 
        ],
      },
      {
        id: "s30",
        texts:   [
          "¡Chambix tiene un consejo! ", 
          "Antes de pedir un préstamo, realiza un plan. ", 
        ],
      },
      {
        id: "s31",
        texts:   [
          "¡Cuidado con las deudas!", 
          "Los intereses pueden volverse cada vez más grandes.", 
        ],
      },
      {
        id: "s32",
        texts:   [
          "Invertir sabiamente hoy puede traer grandes beneficios mañana.", 
          "¿En qué te gustaría invertir?", 
        ],
      },
      {
        id: "s33",
        texts:   [
          "¡Chambix aprendió algo importante y lo quiere compartir contigo!", 
          "Si tomas un préstamo, asegúrate de utilizarlo sabiamente.", 
        ],
      },
      {
        id: "s34",
        texts:   [
          "Ahorrar es genial, pero invertir bien es aún mejor.", 
          "¿Cómo podríamos hacer crecer nuestro dinero?", 
        ],
      },
      {
        id: "s35",
        texts:   [
          "Antes de gastar, recuerda lo siguiente:", 
          "una deuda sin plan para devolverla puede ser en un problema.", 
        ],
      },
      {
        id: "s36",
        texts:   [
          "¡Los intereses pueden jugar a tu favor!", 
          "En una buena inversión, los intereses harán crecer tu dinero.", 
        ],
      },
      {
        id: "s37",
        texts:   [
          "¡Consejo Chambix! ", 
          "Hay distintas formas de invertir en tu emprendimiento.",
          "Puedes solicitar un préstamo en vez de usar tus ahorros.",
          " ¡Pero cuidado! Solo conviene si sabes que puedes devolverlo." 
        ],
      },
      {
        id: "s38",
        texts:   [
          "Tener un buen fondo de emergencia te deja a salvo.", 
          "Estarás cubierto frente a cualquier imprevisto.",
          "¡Estrategia financiera, Chambix style!" 
        ],
      },
      {
        id: "s39",
        texts:   [
          "¡Tomar un préstamo no es algo malo!", 
          " Úsalo para algo que te hará crecer, como un buen emprendimiento."
        ],
      },
      {
        id: "s40",
        texts:   [
          "Usar los ahorros para todo puede dejarte sin respaldo.", 
          "A veces, una deuda bien administrada es una mejor opción." 
        ],
      },
      {
        id: "s41",
        texts:   [
          "¡Chambix aprendió algo importante!", 
          "Pedir un préstamo puede ser más inteligente que quedarse sin ahorros.",
          "Todo depende del contexto." 
        ],
      },
      {
        id: "s42",
        texts:   [
          "Imagina un préstamo con interés bajo. ", 
          "Imagina que puedas devolverlo cómodamente.",
          "Este podría ayudarte a crecer sin afectar tus ahorros." 
        ],
      },
      {
        id: "s43",
        texts:   [
          "El fondo de emergencia es un escudo de protección. ", 
          "Si en algún momento lo usas, luego debes renovarlo." 
        ],
      },
      {
        id: "s44",
        texts:   [
          "¡Estrategia financiera en acción!", 
          " Un préstamo bien usado puede ser una herramienta poderosa.",
          "Te puede ayudar a lograr grandes metas." 
        ],
      },
      {
        id: "s45",
        texts:   [
          "¿Gastar todos los ahorros o tomar un préstamo?", 
          "¡Depende de la situación! ",
          "Pero siempre es bueno planificar antes de tomar una decisión." 
        ],
      },
      {
        id: "s46",
        texts:   [
          "¡Chambix inteligente! ", 
          "Imagina invertir tu dinero en un instrumento con buen interés...",
          "Puede crecer más de lo que esperas.",
          "¡Magia financiera!" 
        ],
      },
      {
        id: "s47",
        texts:   [
          "¿Sabías que no todas las inversiones son iguales?", 
          "Algunas te dan más interés (pero tienen más riesgo). ",
          "Hay otras menos riesgosas pero que te dan menos retorno.",
          "¡Elegir lo que funciona para tus objetivos es la clave!" 
        ],
      },
      {
        id: "s48",
        texts:   [
          "Invertir sin revisar el interés es como saltar sin ver dónde caerás.", 
          "¡Presta atención antes de decidir!" 
        ],
      },
      {
        id: "s49",
        texts:   [
          "¿Quieres que tu dinero trabaje por ti?", 
          "Busca inversiones con buen interés y verás cómo crece con el tiempo." 
        ],
      },
      {
        id: "s50",
        texts:   [
          "El interés puede jugar a tu favor si inviertes sabiamente.", 
          "¡Chambix lo llama el efecto multiplicador del dinero!" 
        ],
      },
      {
        id: "s51",
        texts:   [
          "No solo es importante cuánto inviertes, sino cuánto puedes ganar.", 
          "¡Siempre revisa bien las opciones!" 
        ],
      },
      {
        id: "s52",
        texts:   [
          "No existe una inversión que sea buena para todo el mundo.", 
          "Primero debemos saber cuáles son nuestras metas y necesidades",
          "Y luego debemos ver qué inversión se adapta mejor a las mismas." 
        ],
      },
      {
        id: "s53",
        texts:   [
          "¡Cuidado! Una inversión que ofrece ganancias altas puede ser tentadora...", 
          "Pero en general, cuanto mayor es la ganancia, mayor es el riesgo.",
          "¡Siempre investiga antes de tomar estas decisiones!" 
        ],
      },
      {
        id: "s54",
        texts:   [
          "Los hermanos Wright tardaron años en lograr el primer vuelo.", 
          "Hoy, aviones cruzan el cielo cada segundo.",
          "¿Qué idea cambiará el futuro?" 
        ],
      },
      {
        id: "s55",
        texts:   [
          "Un mensaje tardaba meses en cruzar el mar.", 
          "Luego, alguien encontró la forma de enviarlo en un parpadeo." 
        ],
      },
      {
        id: "s56",
        texts:   [
          "La primera moneda se acuñó con las manos.", 
          "Siglos después, el dinero se mueve sin que lo toquemos." 
        ],
      },
      {
        id: "s57",
        texts:   [
          "Woooww… Qué increíble es vivir en una ciudad que tenga playa cerca." 
        ],
      },
      {
        id: "s58",
        texts:   [
          "¿Chambear y luego ir a la playa a relajar?", 
          "¿Eso en verdad es posible o estoy soñando?" 
        ],
      },
      {
        id: "s59",
        texts:   [
          "Antes, el café solo se preparaba en casa. ", 
          "Luego, alguien abrió una pequeña tienda y...",
          "lo que era solo una bebida se transformó en un lugar de encuentro."
        ],
      },
      {
        id: "s60",
        texts:   [
          "Las primeras cafeterías fueron lugares de reunión y debate.", 
          "Hoy, siguen siendo el primer paso de muchos grandes proyectos." 
        ],
      },
      {
        id: "s61",
        texts:   [
          "Alguien olvidó un grano en la tierra... ", 
          "y este se convirtió en la bebida más consumida después del agua.",
          "Todo gran emprendimiento comienza con una semilla." 
        ],
      },
      {
        id: "s62",
        texts:   [
          "Las primeras deudas se pagaban con cosechas.", 
          "Hay que ser cuidadoso: hoy, un solo clic puede endeudarte por años." 
        ],
      },
      {
        id: "s63",
        texts:   [
          "Hoy, gracias a las pantallas y apps, invertir es más fácil que nunca.", 
          "Pero recuerda que hay que hacerlo con metas y planificación.",
          "No debemos dejarnos llevar por la publicidad ni por impulsos." 
        ],
      },
      {
        id: "s64",
        texts:   [
          "Has conseguido un montón de cosas hasta ahora...", 
          "has avanzado tanto que...",
          "mañana sucederá algo increíble." 
        ],
      },
      
    ];
  }

  static getInstance() {
    if (!Dreams.instance) {
      Dreams.instance = new Dreams();
    }
    return Dreams.instance;
  }

  removeDreamsAlreadyViewed(dreams: DreamType[]) {
    const {dreamsViewed}: globalState = EventsCenterManager.emitWithResponse(
      EventsCenterManager.possibleEvents.GET_STATE,
      null
    );
    dreams = dreams.filter(dream => !dreamsViewed.includes(dream.id));
    return dreams;
  }

  setDreamPool(dreams: DreamType[]) {
    this.dreamPool = this.removeDreamsAlreadyViewed(dreams);
  }

  getRandomFromPool(): DreamType {
    if(this.makeItSecuencial) {
      if(this.dreamPool.length === 0) {
       this.makeItSecuencial = false;
       return this.getRandomFromPool();
      } else {
        const dream = this.dreamPool[0];
        this.dreamPool.splice(0,1);
        return dream
      }
    } else {
      let position = Math.floor(Math.random() * this.dreamPool.length)
      if(this.dreamPool.length === 0) {
        position = Math.floor(Math.random() * this.allPool.length)
        const dream = this.allPool[position];
        return dream
      }else {
        const dream = this.dreamPool[position];
        this.dreamPool.splice(position,1);
        return dream 
      }
    }
  }

  stopAllOtherClicksAndInteractions() {
    if (this.scene) this.scene.player?.setCanMove(false);
  }

  resumeAllClicksAndInteractions() {
    if (this.scene) this.scene.player?.setCanMove(true);
  }

  createDream(scene: RPG, closeDream: Function) {
    this.scene = scene;
    this.closeFunction = closeDream;
    if (this.containerBox) {
      this.containerBox.destroy();
    }
    // over a black mask, create an animation to display every line from dream object
    // on white bold text, one below the otherone

    this.acuText = true;
    const { width, height } = scene.cameras.main;
    this.blackScreen = scene.add.graphics();
    this.blackScreen.fillStyle(0x000000, 1);
    this.blackScreen.fillRect(0, 0, width, height);
    //hitArea to avoid click through
    const hitArea = new Phaser.Geom.Rectangle(0, 0, width, height);
    this.blackScreen.setInteractive(hitArea, (c) => {
      scene.input.stopPropagation();
      return true;
    });

    this.containerBox = scene.add.container(0, 0);
    this.containerBox.setDepth(999999);
    this.containerBox.add(this.blackScreen);

    this.text = scene.add.text(0, 0, "", {
      fixedWidth: width - 100,
      fontFamily: "Arial",
      fontSize: 40,
      color: "#ffffff",
      align: "center",
      wordWrap: { width: width - 100 },
    });

    //move text to the center of the screen
    this.text.x = width / 2 - this.text.width / 2;
    this.text.y = height / 2 - this.text.height / 2;

    this.text.y = this.text.y - this.text.height / 2;

    this.containerBox.add(this.text);

    // const closeBtn = scene.add.text(0, 0, "Cerrar", {
    //   fontFamily: "Arial",
    //   fontSize: 20,
    //   color: "#000000",
    //   align: "center",
    // });
    // closeBtn.setInteractive();
    // this.containerBox.add(closeBtn);

    // closeBtn.on("pointerdown", () => {
    //   this.containerBox.destroy();
    //   closeDream();
    // });

    this.containerBox.setAlpha(0);
  }

  showDream(dream: DreamType, index: number) {
    // use tween to appear text
    if (!this.scene) return;
    this.scene.tweens.add({
      targets: this.text,
      alpha: 0,
      duration: 100,
      onComplete: () => {
        let dreamText = dream.texts
        if (this.acuText) {
          let allTextTilIndex = dreamText.slice(0, index);
          this.text?.setText(allTextTilIndex.join("\n"));
        } else {
          this.text?.setText(dreamText[index]);
        }
        this.scene?.tweens.add({
          targets: this.text,
          alpha: 1,
          duration: 100,
        });
      },
    });
  }

  playDream() {
    if (!this.scene) return;
    this.stopAllOtherClicksAndInteractions();
    if (this.containerBox) {
      this.dreamToShow = this.getRandomFromPool();
      this.index = 0;

      this.scene.cameras.cameras.forEach((camera) => {
        if (this.scene?.UICamera && this.scene?.UICamera.id === camera.id)
          return;
        camera.ignore(this.containerBox!);
      });
      this.containerBox.setDepth(999999);
      this.containerBox.setAlpha(1);
      this.index++;
      this.showDream(this.dreamToShow, this.index);
      // this.blackScreen!.setInteractive(true)
      // this.blackScreen!.on("pointerdown",this.clickToCloseDream.bind(this));
      this.scene?.time.delayedCall(1500, () => {
        this.clickToCloseDream();
      });
    }
  }

  clickToCloseDream() {
    if(this.index === undefined || this.dreamToShow === undefined) return;
    this.index++;
    if (this.index > this.dreamToShow.texts.length) {
      // this.blackScreen!.off("pointerdown",this.clickToCloseDream.bind(this));
      this.containerBox!.destroy();
      if (this.closeFunction) this.closeFunction(this.dreamToShow);
      this.resumeAllClicksAndInteractions();
    } else {
      this.showDream(this.dreamToShow, this.index);
      if (this.index == this.dreamToShow.texts.length) {
        this.scene?.time.delayedCall(2000, () => {
          // this.blackScreen!.off("pointerdown",this.clickToCloseDream.bind(this));
          this.containerBox!.destroy();
          if (this.closeFunction) this.closeFunction(this.dreamToShow);
          this.resumeAllClicksAndInteractions();
        });
      } else {
        this.scene?.time.delayedCall(1500, () => {
          this.clickToCloseDream();
        });
      }
    }
    
  }
}

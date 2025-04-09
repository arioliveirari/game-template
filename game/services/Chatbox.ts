import ObserverPatronModule from "../modules/ObserverPatronModule";

export type MessageActions = {
    text: string;
    nextMessage?: Partial<Message>;
    response?: Partial<Message>;
};

export type MessageOptions = {
    actions?: MessageActions[]
    actionSelected?: number;
};

export type Message = {
    messageId?: string;
    actorId: string;
    text: string[];
    options?: MessageOptions;
};

export type Chat = {
    actors: string[];
    messages: Message[];
};

export type Actor = {
    id: string;
    name: string;
    readed: boolean;
};

export type ChatboxState = {
    chats: Chat[];
    actors?: Actor[];
    messages: Message[];
};

const emptyState: ChatboxState = {
    chats: [],
    messages: [],
    actors: [
        {
            id: "player",
            name: "Player",
            readed: true
        },
        {
            id: "mama",
            name: "Mamá",
            readed: true
        },
        {
            id: "vecino",
            name: "Vecino",
            readed: true
        },
    ]
}

export class Chatbox extends ObserverPatronModule<ChatboxState> {
    constructor() {
        super(emptyState);
    }

    public markActorChatReaded(id: string) {
        const { actors } = this.getState();
        const actor = actors?.find(actor => actor.id === id);
        if (actor) {
            actor.readed = true;
            this.notify(this.getState());
        }
    }

    public markActorChatUnreaded(id: string) {
        const { actors } = this.getState();
        const actor = actors?.find(actor => actor.id === id);
        if (actor) {
            actor.readed = false;
            this.notify(this.getState());
        }
    }

    public getChatsFromActor(id: string) {
        const { chats } = this.getState();

        const find = chats.filter(chat => chat.actors.includes(id));
        this.markActorChatReaded(id);
        if (find.length) return find;
        else {
            // return dummy chat with a message like "this contact didint send any message yet"
            const dummyChat: Chat = {
                actors: ["player", id],
                messages: [
                    {
                        actorId: id,
                        text: ["Este contacto no ha enviado ningún mensaje aún"]
                    }
                ]
            }
            return [dummyChat];
        }

    }

    public getAllActors(orderByReaded: boolean = false) {
        const { actors } = this.getState();
        let filterPlayerActor = actors?.filter(actor => actor.id !== "player");
        if (orderByReaded) {
            filterPlayerActor = filterPlayerActor?.sort((a, b) => {
                if (a.readed && !b.readed) return 1;
                if (!a.readed && b.readed) return -1;
                return 0;
            });
        }
        return filterPlayerActor || [];
    }

    public addActor(actor: Actor) {
        const { actors } = this.getState();
        this.changeState({ ...this.getState(), actors: [...(actors || []), actor] });
    }

    public addChat(chat: Chat) {
        const { chats } = this.getState();
        const find = [...chats].find(c => c.actors.includes(chat.actors[0]) && c.actors.includes(chat.actors[1]));
        if (find) {
            find.messages.push(...chat.messages);
            const newChats = [...chats].splice(chats.indexOf(find), 1);
            this.changeState({ ...this.getState(), chats: [...newChats] });
            return;
        } else {
            this.changeState({ ...this.getState(), chats: [...chats, { ...chat }] });
        }
    }

    public listChatsWithOptionsFromActor(id: string) {
        const chats = this.getChatsFromActor(id);
        return chats.map(chat => {
            const messages = chat.messages.map(message => {
                const text = message.text.join("\n");
                const actions = message.options?.actions;
                return { text, actions };
            });
            return { messages };
        });
    }

    public addResponseAsMessage(actorId: string, chatIndex: number, response: string) {
        const chats = this.getChatsFromActor(actorId);
        const chat = chats[chatIndex];
        const message = { actorId, text: [response] };
        chat.messages.push(message);
        this.notify(this.getState());
    }

    public selectActionFromChat(chat: Chat, messageId: string, actionIndex: number) {

        const message = chat.messages.find(message => message.messageId === messageId);
        if (!message) {
            return;
        }
        const action = message.options?.actions?.[actionIndex];
        if (!action) {
            return;
        }
        chat.messages.push({ text: [action.text], actorId: "Player" });

        if (action.response) {
            let response = action.response;
            if (!action.text) {
                let fullResponse = this.hidrateMessageWithMessageId(response);
                if (fullResponse) chat.messages.push({ ...fullResponse, messageId: `${messageId}-${actionIndex}-response`, actorId: "npc" });
            } else {
                chat.messages.push({ ...(response as Message), messageId: `${messageId}-${actionIndex}-response`, actorId: "npc" });
            }
        }
        if (action.nextMessage) {
            let nextMessage = action.nextMessage;
            if (!action.text) {
                let fullNextMessage = this.hidrateMessageWithMessageId(nextMessage);
                if (fullNextMessage) chat.messages.push({ ...fullNextMessage, messageId: `${messageId}-${actionIndex}-next`, actorId: "npc" });
            } else {
                chat.messages.push({ ...(nextMessage as Message), messageId: `${messageId}-${actionIndex}-next`, actorId: "npc" });
            }

        }

    }

    public checkIfThereIsAnyChatPendingReading() {
        const { actors } = this.getState();
        return actors?.some(actor => !actor.readed);
    }

    public addChatMocked({ id }: { id: string }) {
        switch (id) {
            case "mama":
                const chatMama: Chat = {
                    actors: ["player", "mama"],
                    messages: [
                        {
                            text: ["Hola hijo, ¿cómo estás?"],
                            actorId: "mama",
                            messageId: "9",
                            options: {
                                actions: [
                                    {
                                        text: "Bien, gracias",
                                        response: {
                                            text: ["Me alegra escuchar eso"],
                                            actorId: "mama",
                                            messageId: "10",
                                        },
                                        nextMessage: {
                                            text: ["¿Cómo te fue en la escuela?"],
                                            actorId: "mama",
                                            messageId: "11",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "Bien, gracias",
                                                        response: {
                                                            text: ["Me alegra escuchar eso"],
                                                            actorId: "mama",
                                                            messageId: "12",
                                                        },
                                                        nextMessage: {
                                                            text: ["¿Quieres que te prepare algo de comer?"],
                                                            actorId: "mama",
                                                            messageId: "13",
                                                            options: {
                                                                actions: [
                                                                    {
                                                                        text: "Si, por favor",
                                                                        response: {
                                                                            text: ["Claro, enseguida"],
                                                                            actorId: "mama",
                                                                            messageId: "14",
                                                                        }
                                                                    },
                                                                    {
                                                                        text: "No, gracias",
                                                                        response: {
                                                                            text: ["Bueno, si cambias de opinión, avísame"],
                                                                            actorId: "mama",
                                                                            messageId: "15",
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        text: "Mal, no me fue bien en el examen",
                                                        response: {
                                                            text: ["No te preocupes, la próxima vez te irá mejor"],
                                                            actorId: "mama",
                                                            messageId: "16",
                                                        },
                                                        nextMessage: {
                                                            text: ["¿Quieres que te prepare algo de comer?"],
                                                            actorId: "mama",
                                                            messageId: "17",
                                                            options: {
                                                                actions: [
                                                                    {
                                                                        text: "Sí, por favor",
                                                                        response: {
                                                                            text: ["Claro, enseguida"],
                                                                            actorId: "mama",
                                                                            messageId: "18",
                                                                        }
                                                                    },
                                                                ]
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }

                this.addChat(chatMama);
                this.markActorChatUnreaded("mama");
                break;
            case "ricardo":
                const chatRicardo: Chat = {
                    actors: ["player", "ricardo"],
                    messages: [
                        {
                            text: ["Hola, cómo estás?"],
                            actorId: "ricardo",
                            messageId: "111",
                            options: {
                                actions: [
                                    {
                                        text: "Bien, lleno de energía.",
                                        response: {
                                            text: ["Bueno... tengo un encargo para ti."],
                                            actorId: "ricardo",
                                            messageId: "112",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "¡Cuéntame más!",
                                                        response: {
                                                            text: ["Un vecino necesita a alguien que sepa sacar buenas fotos y pensé en tí, ¿te interesa?"],
                                                            actorId: "ricardo",
                                                            messageId: "113",
                                                            options: {
                                                                actions: [
                                                                    {
                                                                        text: "Claro, quiero chambear",
                                                                    },
                                                                    {
                                                                        text: "Creo que sí..."
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        text: "Estoy con poco tiempo pero igual me interesa.",
                                                        response: {
                                                            text: ["Un vecino necesita a alguien que sepa sacar buenas fotos y pensé en tí, ¿te interesa?"],
                                                            actorId: "ricardo",
                                                            messageId: "114",
                                                            options: {
                                                                actions: [
                                                                    {
                                                                        text: "Claro, quiero chambear",
                                                                    },
                                                                    {
                                                                        text: "Creo que sí..."
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        text: "Agotado, estuve chambeando todo el día.",
                                        response: {
                                            text: ["Bueno... tengo un encargo para ti."],
                                            actorId: "ricardo",
                                            messageId: "115",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "¡Cuéntame más!",
                                                        response: {
                                                            text: ["Un vecino necesita a alguien que sepa sacar buenas fotos y pensé en tí, ¿te interesa?"],
                                                            actorId: "ricardo",
                                                            messageId: "116",
                                                            options: {
                                                                actions: [
                                                                    {
                                                                        text: "Claro, quiero chambear",
                                                                    },
                                                                    {
                                                                        text: "Creo que sí..."
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        text: "Estoy con poco tiempo pero igual me interesa.",
                                                        response: {
                                                            text: ["Un vecino necesita a alguien que sepa sacar buenas fotos y pensé en tí, ¿te interesa?"],
                                                            actorId: "ricardo",
                                                            messageId: "117",
                                                            options: {
                                                                actions: [
                                                                    {
                                                                        text: "Claro, quiero chambear",
                                                                    },
                                                                    {
                                                                        text: "Creo que sí..."
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        text: "No muy animado, por qué?",
                                        response: {
                                            text: ["Bueno... tengo un encargo para ti."],
                                            actorId: "ricardo",
                                            messageId: "118",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "¡Cuéntame más!",
                                                        response: {
                                                            text: ["Un vecino necesita a alguien que sepa sacar buenas fotos y pensé en tí, ¿te interesa?"],
                                                            actorId: "ricardo",
                                                            messageId: "119",
                                                            options: {
                                                                actions: [
                                                                    {
                                                                        text: "Claro, quiero chambear",
                                                                    },
                                                                    {
                                                                        text: "Creo que sí..."
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        text: "Estoy con poco tiempo pero igual me interesa.",
                                                        response: {
                                                            text: ["Un vecino necesita a alguien que sepa sacar buenas fotos y pensé en tí, ¿te interesa?"],
                                                            actorId: "ricardo",
                                                            messageId: "120",
                                                            options: {
                                                                actions: [
                                                                    {
                                                                        text: "Claro, quiero chambear",
                                                                    },
                                                                    {
                                                                        text: "Creo que sí..."
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },

                                ]
                            }
                        }
                    ]
                }
                this.addActor({ id: "ricardo", name: "Ricardo", readed: false });
                this.addChat(chatRicardo);
                this.markActorChatUnreaded("ricardo");
                break;

            // agregar todos los cases con los nuevos chats PRECK
            case "marcos":
                const chatMarcos: Chat = {
                    actors: ["player", "marcos"],
                    messages: [
                        {
                            text: ["¡Hola! Acabo de recibir mucho dinero y no sé qué hacer."],
                            actorId: "marcos",
                            messageId: "190909",
                            options: {
                                actions: [
                                    {
                                        text: "¡Gástala! Ahorraremos luego...",
                                        response: {
                                            text: ["Tengo dudas..."],
                                            actorId: "marcos",
                                            messageId: "2324",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "Recuerda que tienes Chambix Academy...",
                                                        response: {
                                                            text: ["¡Buena idea! ¡Gracias!"],
                                                            actorId: "marcos",
                                                            messageId: "332434",
                                                        }
                                                    },
                                                    {
                                                        text: "Establecer tus metas puede ayudarte...",
                                                        response: {
                                                            text: ["¡Buena idea! ¡Gracias!"],
                                                            actorId: "marcos",
                                                            messageId: "4435",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        text: "Guárdatela para una ocasión especial.",
                                        response: {
                                            text: ["Tengo dudas..."],
                                            actorId: "marcos",
                                            messageId: "5435",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "Recuerda que tienes Chambix Academy...",
                                                        response: {
                                                            text: ["¡Buena idea! ¡Gracias!"],
                                                            actorId: "marcos",
                                                            messageId: "6",
                                                        }
                                                    },
                                                    {
                                                        text: "Establecer tus metas puede ayudarte...",
                                                        response: {
                                                            text: ["¡Buena idea! ¡Gracias!"],
                                                            actorId: "marcos",
                                                            messageId: "7",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        text: "¡Investiga antes de decidir!",
                                        response: {
                                            text: ["Tengo dudas..."],
                                            actorId: "marcos",
                                            messageId: "5324",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "Recuerda que tienes Chambix Academy...",
                                                        response: {
                                                            text: ["¡Buena idea! ¡Gracias!"],
                                                            actorId: "marcos",
                                                            messageId: "64354",
                                                        }
                                                    },
                                                    {
                                                        text: "Establecer tus metas puede ayudarte...",
                                                        response: {
                                                            text: ["¡Buena idea! ¡Gracias!"],
                                                            actorId: "marcos",
                                                            messageId: "7453435",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
                this.addActor({ id: "marcos", name: "Marcos", readed: false });
                this.addChat(chatMarcos);
                this.markActorChatUnreaded("marcos")
                break;

            case "julieta":
                const chatJulieta: Chat = {
                    actors: ["player", "julieta"],
                    messages: [
                        {
                            text: ["Oye, no sé si ahorrar para comprar una bici nueva o si es mejor guardar el dinero..."],
                            actorId: "julieta",
                            messageId: "1768",
                            options: {
                                actions: [
                                    {
                                        text: "Ya tienes una buena. ¿Para qué comprar otra?",
                                        response: {
                                            text: ["Sucede que vi una buena oferta de bici y creo que me tenté. Pero puede ser que no tenga tanto sentido comprarla... no estoy segura."],
                                            actorId: "julieta",
                                            messageId: "2789",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "Haz Deseos vs necesidades de Chambix Academy",
                                                        response: {
                                                            text: ["¡Genial, gracias!"],
                                                            actorId: "julieta",
                                                            messageId: "3980",
                                                        }
                                                    },
                                                    {
                                                        text: "¿La deseas o la necesitas? No es lo mismo...",
                                                        response: {
                                                            text: ["¡Genial, gracias!"],
                                                            actorId: "julieta",
                                                            messageId: "4567",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        text: "Amo las bicis, ¿en serio quieres otra?",
                                        response: {
                                            text: ["Sucede que vi una buena oferta de bici y creo que me tenté. Pero puede ser que no tenga tanto sentido comprarla... no estoy segura."],
                                            actorId: "julieta",
                                            messageId: "578768",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "Haz Deseos vs necesidades de Chambix Academy",
                                                        response: {
                                                            text: ["¡Genial, gracias!"],
                                                            actorId: "julieta",
                                                            messageId: "687989",
                                                        }
                                                    },
                                                    {
                                                        text: "¿La deseas o la necesitas? No es lo mismo...",
                                                        response: {
                                                            text: ["¡Genial, gracias!"],
                                                            actorId: "julieta",
                                                            messageId: "756767",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
                this.addActor({ id: "julieta", name: "Julieta", readed: false });

                this.addChat(chatJulieta);
                this.markActorChatUnreaded("julieta")
                break;

            case "manuel":
                const chatManuel: Chat = {
                    actors: ["player", "manuel"],
                    messages: [
                        {
                            text: ["¡Hola! ¿Sabes cuál es el riesgo de no tener un fondo de emergencia? Me insisten en que arme uno."],
                            actorId: "manuel",
                            messageId: "15465",
                            options: {
                                actions: [
                                    {
                                        text: "Si surge un gasto imprevisto estás en problemas.",
                                        response: {
                                            text: ["¡Uy! ¿Debería empezar ya no? Tengo que entender cómo comenzar"],
                                            actorId: "manuel",
                                            messageId: "2435",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "Haz Antídoto contra emergencias en Chambix Academy.",
                                                        response: {
                                                            text: ["¡Dale!"],
                                                            actorId: "manuel",
                                                            messageId: "323454",
                                                        }
                                                    },
                                                    {
                                                        text: "Síii, ¡te recomiendo que aprendas sobre el tema!",
                                                        response: {
                                                            text: ["¡Dale!"],
                                                            actorId: "manuel",
                                                            messageId: "47456",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        text: "No tengo idea.",
                                        response: {
                                            text: ["¡Ouch! Yo tampoco, pero esperaba que tú supieras jajaja"],
                                            actorId: "manuel",
                                            messageId: "56578",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "Haré el curso Antídoto contra emergencias...",
                                                        response: {
                                                            text: ["¡Dale!"],
                                                            actorId: "manuel",
                                                            messageId: "645654",
                                                        }
                                                    },
                                                    {
                                                        text: "Me estoy dando cuenta de que el tema es realmente importante...",
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
                this.addActor({ id: "manuel", name: "Manuel", readed: false });

                this.addChat(chatManuel);
                this.markActorChatUnreaded("manuel")
                break;

            case "federico":
                const chatFederico: Chat = {
                    actors: ["player", "federico"],
                    messages: [
                        {
                            text: ["Hola! Tengo un problema! ¿Me puedes ayudar?"],
                            actorId: "federico",
                            messageId: "13242",
                            options: {
                                actions: [
                                    {
                                        text: "Claro, ¿qué ha pasado?",
                                        response: {
                                            text: ["Falta una semana para fin de mes y el dinero ya no me alcanza."],
                                            actorId: "federico",
                                            messageId: "234543",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "¿Muchos gastos hormiga? Golosinas, cafés, etc...",
                                                        response: {
                                                            text: ["Uhh claro, voy a revisar porque tal vez haya sido eso..."],
                                                            actorId: "federico",
                                                            messageId: "346534",
                                                        }
                                                    },
                                                    {
                                                        text: "Revisa tus suscripciones y controla tu dinero digital.",
                                                        response: {
                                                            text: ["Uhh claro, voy a revisar porque tal vez haya sido eso..."],
                                                            actorId: "federico",
                                                            messageId: "43234",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        text: "Síiiii",
                                        response: {
                                            text: ["Falta una semana para fin de mes y el dinero ya no me alcanza. "],
                                            actorId: "federico",
                                            messageId: "5435435",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "¿Muchos gastos hormiga? Golosinas, cafés, etc...",
                                                        response: {
                                                            text: ["Uhh claro, voy a revisar porque tal vez haya sido eso...!"],
                                                            actorId: "federico",
                                                            messageId: "623423",
                                                        }
                                                    },
                                                    {
                                                        text: "Revisa tus suscripciones y controla tu dinero digital.",
                                                        response: {
                                                            text: ["Uhh claro, voy a revisar porque tal vez haya sido eso...!"],
                                                            actorId: "federico",
                                                            messageId: "6325325",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
                this.addActor({ id: "federico", name: "Federico", readed: false });
                this.addChat(chatFederico);
                this.markActorChatUnreaded("federico")
                break;

            case "mama1":
                const chatMama1: Chat = {
                    actors: ["player", "mama"],
                    messages: [
                        {
                            text: ["Vi que hay cursos cortos disponibles en Chambix Academy que pueden servirte mucho..."],
                            actorId: "mama",
                            messageId: "132423",
                            options: {
                                actions: [
                                    {
                                        text: "¿Sobre qué son los cursos?",
                                        response: {
                                            text: ["Sobre finanzas personales y cuestiones claves para emprendimientos."],
                                            actorId: "mama",
                                            messageId: "2435435",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "Oh genial, voy a buscarlos.",
                                                        response: {
                                                            text: ["¡Perfecto! ¡Éxitos!"],
                                                            actorId: "mama",
                                                            messageId: "343543",
                                                        }
                                                    },
                                                    {
                                                        text: "Mmm ok, nunca lo había pensado antes",
                                                        response: {
                                                            text: ["¡Revisa Chambix Academy!"],
                                                            actorId: "mama",
                                                            messageId: "4324324",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        text: "Estoy ocupado estos días con mis trabajos. ",
                                        response: {
                                            text: ["Mmmm bueno, realmente creo que pueden ser útiles, justamente para organizar el dinero que ganes. "],
                                            actorId: "mama",
                                            messageId: "543543",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "Bueno, veré más adelante si me da el tiempo. ",
                                                        response: {
                                                            text: ["¡Genial!"],
                                                            actorId: "mama",
                                                            messageId: "6435435",
                                                        }
                                                    },
                                                    {
                                                        text: "Ok, me interesa lo que dices, lo pensaré",
                                                        response: {
                                                            text: ["Grandioso"],
                                                            actorId: "mama",
                                                            messageId: "7435435",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
                this.addChat(chatMama1);
                this.markActorChatUnreaded("mama")
                break;
            case "mama2":
                const chatMama2: Chat = {
                    actors: ["player", "mama"],
                    messages: [
                        {
                            text: ["Me ha llegado el gasto de tu tarjeta de crédito. Creo que debes hacer algo para manejar mejor tu dinero."],
                            actorId: "mama",
                            messageId: "13243",
                            options: {
                                actions: [
                                    {
                                        text: "Uy, no lo noté, este mes tuve muchos gastos. ",
                                        response: {
                                            text: ["Ok. Es importante que seas conciente de tus gastos. Tal vez organizarte pueda ayudarte..."],
                                            actorId: "mama",
                                            messageId: "243545",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "No lo había pensado, tienes razón",
                                                        response: {
                                                            text: ["Claro, no es algo fácil. El curso de Metas en Chambix Academy seguro pueda ayudarte."],
                                                            actorId: "mama",
                                                            messageId: "343545",
                                                        }
                                                    },
                                                    {
                                                        text: "Sí, solo que me cuesta un poco...",
                                                        response: {
                                                            text: ["Claro, no es algo fácil. El curso de Metas en Chambix Academy seguro pueda ayudarte."],
                                                            actorId: "mama",
                                                            messageId: "43243",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        text: "¡Ah sí, este mes salí mucho con amigos!",
                                        response: {
                                            text: ["Ok. Es importante que seas conciente de tus gastos. Tal vez organizarte pueda ayudarte..."],
                                            actorId: "mama",
                                            messageId: "5435435",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "No lo había pensado, tienes razón",
                                                        response: {
                                                            text: ["Claro, no es algo fácil. El curso de Metas en Chambix Academy seguro pueda ayudarte."],
                                                            actorId: "mama",
                                                            messageId: "6435345",
                                                        }
                                                    },
                                                    {
                                                        text: "Sí, solo que me cuesta un poco...",
                                                        response: {
                                                            text: ["Claro, no es algo fácil. El curso de Metas en Chambix Academy seguro pueda ayudarte."],
                                                            actorId: "mama",
                                                            messageId: "734534",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
                this.addChat(chatMama2);
                this.markActorChatUnreaded("mama")
                break;

            case "lupita":
                const chatLupita: Chat = {
                    actors: ["player", "lupita"],
                    messages: [
                        {
                            text: ["¡Hola! Me ofrecieron una inversión con una promesa de ganancia alta (aprox. 20% en dólares mensual). ¿Qué te parece?"],
                            actorId: "lupita",
                            messageId: "13454",
                            options: {
                                actions: [
                                    {
                                        text: "¡Entro! Parece una buena opción. ",
                                        response: {
                                            text: ["¿No deberíamos sospechar de estas promesas?"],
                                            actorId: "lupita",
                                            messageId: "2456546",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "Sí, es raro. Mejor no entrar. ",
                                                        response: {
                                                            text: ["Ok, gracias por tu ayuda."],
                                                            actorId: "lupita",
                                                            messageId: "3456546",
                                                        }
                                                    },
                                                    {
                                                        text: "Bueno pero quien no ariesga no gana...",
                                                        response: {
                                                            text: ["Sí, puedes tener razón."],
                                                            actorId: "lupita",
                                                            messageId: "446546",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        text: "No entro porque suena a algo que no puede cumplirse.",
                                        response: {
                                            text: ["¡Bien pensado! Podría ser una estafa. "],
                                            actorId: "lupita",
                                            messageId: "52355",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "Sí, hay que tener cuidado.",
                                                        response: {
                                                            text: ["Ok... gracias por tus consejos."],
                                                            actorId: "lupita",
                                                            messageId: "623325",
                                                        }
                                                    },
                                                    {
                                                        text: "Sí, en estos días hay muchas estafas de ese estilo...",
                                                        response: {
                                                            text: ["¡Sí, he visto... ¡Gracias por tu ayuda!"],
                                                            actorId: "lupita",
                                                            messageId: "6546564",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
                this.addActor({ id: "lupita", name: "Lupita", readed: false });
                this.addChat(chatLupita);
                this.markActorChatUnreaded("lupita")
                break;

            case "cliente":
                const chatCliente: Chat = {
                    actors: ["player", "cliente"],
                    messages: [
                        {
                            text: ["¡Hola! Estuve recién en el café y tengo algo para decirte que tal vez puede ayudarte..."],
                            actorId: "cliente",
                            messageId: "1",
                            options: {
                                actions: [
                                    {
                                        text: "Claro, ¿qué ha pasado?",
                                        response: {
                                            text: ["Me pareció ver poquitas bolsas de café. A este ritmo de consumo puedes quedarte sin café en poco tiempo..."],
                                            actorId: "cliente",
                                            messageId: "2",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "Gracias por tu ayuda, voy a revisar bien.",
                                                        response: {
                                                            text: ["¡De nada! Nos vemos pronto por el café."],
                                                            actorId: "cliente",
                                                            messageId: "3",
                                                        }
                                                    },
                                                    {
                                                        text: "Wow, se está vendiendo mucho café. Gracias por el aviso.",
                                                        response: {
                                                            text: ["¡De nada! Nos vemos pronto por el café."],
                                                            actorId: "cliente",
                                                            messageId: "4",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        text: "Por supuesto, ¡cuéntame!",
                                        response: {
                                            text: ["Me pareció ver poquitas bolsas de café. A este ritmo de consumo puedes quedarte sin café en poco tiempo..."],
                                            actorId: "cliente",
                                            messageId: "5",
                                            options: {
                                                actions: [
                                                    {
                                                        text: "¿Gracias por tu ayuda, voy a revisar bien.",
                                                        response: {
                                                            text: ["¡De nada! Nos vemos pronto por el café."],
                                                            actorId: "cliente",
                                                            messageId: "6",
                                                        }
                                                    },
                                                    {
                                                        text: "Wow, se está vendiendo mucho café. Gracias por el aviso.",
                                                        response: {
                                                            text: ["¡De nada! Nos vemos pronto por el café."],
                                                            actorId: "cliente",
                                                            messageId: "6",
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
                this.addActor({ id: "cliente", name: "Cliente", readed: false });

                this.addChat(chatCliente);
                this.markActorChatUnreaded("cliente")
                break;
        }

    }

    public addMockConversation() {

        const chatVecino: Chat = {
            actors: ["player", "vecino"],
            messages: [
                {
                    text: ["Hola vecino, ¿viste el periódico hoy?"],
                    actorId: "vecino",
                    messageId: "1",
                    options: {
                        actions: [
                            {
                                text: "Hola, no, todavía no lo vi",
                                response: {
                                    text: ["Parece que se perdieron unos gatos, ¿los viste?"],
                                    actorId: "vecino",
                                    messageId: "2",
                                    options: {
                                        actions: [
                                            {
                                                text: "No, no los vi",
                                                response: {
                                                    text: ["Bueno, si los ves, avísame por favor"],
                                                    actorId: "vecino",
                                                    messageId: "3",
                                                }
                                            },
                                            {
                                                text: "Sí, los vi, estaban en la esquina",
                                                response: {
                                                    text: ["¡Gracias por avisar!"],
                                                    actorId: "vecino",
                                                    messageId: "4",
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                text: "Hola vecino! Sí, vi que se perdieron unos gatos",
                                response: {
                                    text: ["¡Oh no! ¿Dónde los viste?"],
                                    actorId: "vecino",
                                    messageId: "5",
                                    options: {
                                        actions: [
                                            {
                                                text: "En la esquina de la plaza",
                                                response: {
                                                    text: ["¡Gracias por avisar!"],
                                                    actorId: "vecino",
                                                    messageId: "6",
                                                }
                                            },
                                            {
                                                text: "No los vi",
                                                response: {
                                                    text: ["Bueno, si los ves, avísame por favor"],
                                                    actorId: "vecino",
                                                    messageId: "7",
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        }
        this.addChatMocked({id: "mama"})
        this.addChatMocked({id: "cliente"})
        this.addChatMocked({id: "federico"})
        this.addChatMocked({id: "ricardo"})
        this.addChatMocked({id: "marcos"})
        this.addChatMocked({id: "julieta"})
        this.addChatMocked({id: "manuel"})
        this.addChatMocked({id: "lupita"})
        this.addChat(chatVecino);
        this.markActorChatUnreaded("vecino");
    }

    public createConversationString(chat: Chat) {
        return chat.messages.map(({ text, actorId }) => `${actorId}: ${text.join("\n")}`).join("\n");
    }

    public createOptionsString(options: MessageOptions) {
        return options.actions?.map((action, index) => `${index}: ${action.text}`).join("\n");
    }

    public getLastMessageFromChat(chat: Chat) {
        return chat.messages[chat.messages.length - 1];
    }

    public hidrateMessageWithMessageId(message: Partial<Message>) {
        const newMessage = this.state.messages.find(({ messageId }) => messageId === message.messageId);
        return newMessage;
    }

    public resetState() {
        this.changeState(emptyState);
    }

    public getStateToLocalStorage() {
        return this.getState();
    }

    public setStateFromLocalStorage(localStoreState: ChatboxState | Partial<ChatboxState>) {
        if (localStoreState) {
            Object.keys(localStoreState).forEach(key => {
                if (localStoreState[key as keyof ChatboxState] !== undefined) {
                    // @ts-ignore
                    this.state[key as keyof ChatboxState] = localStoreState[key as keyof ChatboxState];
                }
            });
        }
    }
}

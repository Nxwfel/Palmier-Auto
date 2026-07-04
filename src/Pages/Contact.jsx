import React, { useState } from 'react'
import Map from '../assets/map.jpeg'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: replace alert with real submit (API call)
    alert(`Merci ${name || 'client'}! Nous avons reçu votre message.`)
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div
      id='Contact'
      className='min-h-screen w-screen font-main bg-white flex flex-col justify-end items-start'
    >
      
      {/* Contact Card */}
      <div className='absolute shadow-xl mb-[20vh] md:mb-[25vh] ml-[5vw] max-md:ml-[2vw] h-auto max-h-[70vh] w-[90vw] sm:w-[60vw] md:w-[40vw] lg:w-[25vw] bg-white rounded-lg z-20 p-4 md:p-6 overflow-y-auto'>
        <h3 className='text-xl md:text-2xl font-semibold text-black'>Palmier Auto</h3>
        <p className='text-xs md:text-sm text-neutral-500 mt-1 mb-4'>
          Votre concessionnaire automobile de confiance
        </p>
        
        {/* Dealership Contact */}
        <div className='mb-6 flex flex-col justify-start items-start'>
          <h4 className='font-semibold mb-2 text-amber-400 text-sm md:text-base'>
            Siège Social Principal
          </h4>
          <div className='space-y-2 text-xs md:text-sm'>
            <p>
              <span className='font-medium'>Adresse:</span><br/>
              622 logts bechar 08000 Colomb-Béchar, Algeria
            </p>
            <p>
              <span className='font-medium'>Téléphone:</span><br/>
              <a href="tel:0773964196" className='hover:text-amber-400 transition-colors'>
                0773 96 41 96
              </a>
            </p>
            <p>
              <span className='font-medium'>Email:</span><br/>
              <a href="mailto:Palmier.auto@gmail.com" className='hover:text-amber-400 transition-colors'>
                Palmier.auto@gmail.com
              </a>
            </p>
          </div>
          
          <h4 className='font-semibold mb-2 mt-4 text-amber-400 text-sm md:text-base'>
            Nos Bureaux:
          </h4>
          <Link to={'/Contact'}>
            <div className="flex justify-center items-center gap-12 h-full">
              <div className="bg-gradient-to-b from-stone-300/40 to-transparent p-[4px] rounded-[16px]">
                <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
                  <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-3 py-2">
                    <div className="flex gap-2 items-center">
                      <span className="font-semibold text-amber-400 text-xs md:text-sm">
                        Consultez
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Map Section */}
      <div 
        style={{
          backgroundImage: `url(${Map})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
        className='h-[50vh] md:h-[55vh] w-screen flex justify-center items-center bg-black/20'
      />

      {/* Business Description Section */}
      <section className='w-screen bg-slate-50 py-10 px-4 md:px-8'>
        <div className='mx-auto max-w-6xl space-y-6 text-neutral-800'>
          <h2 className='text-3xl font-semibold'>À propos de Palmier Auto</h2>
          <p className='text-sm leading-8'>
            Palmier Auto est un concessionnaire automobile complet et responsable, dédié à offrir une expérience d’achat de véhicules moderne, transparente et personnalisée. Depuis nos premiers jours, nous nous efforçons de répondre aux besoins des conducteurs qui recherchent une qualité supérieure, une sélection unique et un service attentif. Notre équipe s’engage à accompagner chaque client depuis le premier contact jusqu’à la livraison du véhicule, en apportant des conseils clairs et des solutions parfaitement adaptées.
          </p>
          <p className='text-sm leading-8'>
            Spécialisés dans l’importation de véhicules en provenance d’Europe, d’Asie, d’Amérique du Nord et du Moyen-Orient, nous sélectionnons rigoureusement des modèles qui respectent nos exigences de fiabilité, de sécurité et de performance. Chaque voiture est inspectée avec soin, évaluée selon des normes strictes, puis préparée pour la route afin d’assurer une expérience de conduite optimale dès le premier jour. Nous proposons des véhicules neufs et d’occasion, des SUV, des berlines, des utilitaires et des modèles haut de gamme, afin de répondre aux attentes des particuliers et des professionnels.
          </p>
          <p className='text-sm leading-8'>
            Nos services vont au-delà de la vente. Palmier Auto accompagne aussi ses clients sur les démarches administratives, le financement, l’assurance et la logistique. Nous sommes là pour faciliter les formalités d’immatriculation, proposer des solutions de paiement flexibles et assurer le suivi après-vente. Parce que chaque acheteur mérite de se sentir soutenu, nous nous engageons à fournir un service client disponible, courtois et réactif. Notre objectif est de transformer chaque interaction en une relation de confiance durable.
          </p>
          <p className='text-sm leading-8'>
            Pour les professionnels, nous apportons des solutions personnalisées pour les flottes, les sociétés de transport et les agents commerciaux. Nous proposons des conseils de sélection adaptés aux besoins d’usage, des véhicules avec des options de maintenance maîtrisées, et des partenariats solides pour garantir un approvisionnement constant. Pour les particuliers, nous mettons l’accent sur la transparence des prix, la clarté des informations et les garanties qui apportent la tranquillité d’esprit.
          </p>
          <p className='text-sm leading-8'>
            Situés à Colomb-Béchar, nous sommes fiers de notre présence locale tout en conservant une portée internationale grâce à nos fournisseurs. Nous créons un lien entre les meilleures opportunités du marché mondial et les attentes des clients algériens. Notre approche consiste à proposer des véhicules qui combinent style, confort et économie, en respectant les normes de sécurité et les exigences environnementales. Nous sélectionnons des automobiles capables de rouler sur des routes variées, en tenant compte du climat, des conditions de circulation et des préférences locales.
          </p>
          <p className='text-sm leading-8'>
            Palmier Auto valorise également l’innovation numérique. Notre site web présente une vitrine claire et intuitive où vous pouvez consulter l’inventaire, découvrir les caractéristiques techniques, et prendre contact facilement. Nous utilisons des images de haute qualité pour illustrer notre offre et aider chaque visiteur à visualiser le véhicule qui correspond à ses attentes. Les images de notre page d’accueil sont fournies par http://magnific.com, ce qui contribue à donner une meilleure lisibilité et un rendu professionnel à notre présentation.
          </p>
          <p className='text-sm leading-8'>
            En choisissant Palmier Auto, vous choisissez une entreprise qui place la satisfaction client au cœur de son activité. Vous bénéficiez d’une relation transparente, d’une assistance personnalisée et d’un véritable partenaire pour vos projets automobiles. Nous sommes à votre disposition pour répondre à vos questions, organiser une visite, ou élaborer une offre sur mesure. Notre mission est de vous faire vivre une expérience positive et fiable, qu’il s’agisse d’une première acquisition ou d’un renouvellement de véhicule.
          </p>
          <p className='text-sm leading-8'>
            Merci de faire confiance à Palmier Auto. Nous poursuivons notre engagement pour des véhicules soigneusement choisis, un service attentif et une communication honnête. Notre ambition est de vous aider à trouver le véhicule idéal, en respectant votre budget, vos attentes et votre style de vie. Nous sommes déterminés à offrir un service professionnel qui valorise chaque client, qu’il s’agisse d’un conducteur particulier, d’un manager de flotte ou d’un professionnel à la recherche d’une solution fiable.
          </p>
          <p className='text-xs text-neutral-500'>Les images de la page d’accueil sont issues de http://magnific.com.</p>
        </div>
      </section>

      {/* Footer Section */}
      <div className='w-screen h-auto flex flex-col lg:flex-row justify-between items-start lg:items-center py-6 px-4 md:px-8 gap-6 lg:gap-4 bg-white border-t border-neutral-200'>

        {/* Social Links */}
        <div className='w-full lg:w-auto flex flex-row flex-wrap lg:flex-col gap-4 lg:gap-3 font-main'>
          <motion.a 
            href="https://www.facebook.com/profile.php?id=61574967869777"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-amber-400 transition-colors duration-200 text-sm md:text-base'
          >
            <Facebook size={20} />
            <span>Facebook</span>
          </motion.a>
          
          <motion.a 
            href="https://www.instagram.com/palmier.auto"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-amber-400 transition-colors duration-200 text-sm md:text-base'
          >
            <Instagram size={20} />
            <span>Instagram</span>
          </motion.a>
          
          <motion.a 
            href="mailto:Palmier.auto@gmail.com"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-amber-400 transition-colors duration-200 text-sm md:text-base'
          >
            <Mail size={20} />
            <span>Email</span>
          </motion.a>
        </div>

        {/* Copyright and Credits */}
        <div className='w-full lg:w-auto flex flex-col justify-start items-start lg:items-end gap-2 font-main text-xs md:text-sm'>
          <p className='text-neutral-600'>© 2025 Palmier Auto. Tous droits réservés.</p>
          <motion.a
            href="https://novaq-lemon.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-1.5 text-neutral-500 hover:text-amber-400 transition-colors duration-200'
          >
            <span>Conçu par</span>
            <span className='font-semibold'>NovaQ</span>
            <ExternalLink size={14} />
          </motion.a>
        </div>
      </div>
    </div>
  )
}

export default Contact
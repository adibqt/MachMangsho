import React from 'react';
import { Link } from 'react-router-dom';
import AdibImg from '../assets/Adib.jpg';
import FarhanImg from '../assets/Farhan.jpg';
import TaseenImg from '../assets/Taseen.jpg';

const people = [
  {
    name: 'Adib Rahman',
    role: 'Full‑stack Developer',
    email: 'adibrahman44@gmail.com',
    linkedin: 'https://www.linkedin.com/in/adib-rahman-1a8a502a6/',
    github: 'https://github.com/adibqt',
    photo: AdibImg,
  },
  {
    name: 'Farhan Shahriar Haque',
    role: 'Frontend Developer',
    email: 'farhanshahriar942@gmail.com',
    linkedin: 'https://www.linkedin.com/in/farhan-shahriar-haque/',
    github: 'https://github.com/FarhanSiam042',
    photo: FarhanImg,
  },
  {
    name: 'Taseen Tajwar',
    role: 'Backend Developer',
    email: 'nabintaseen@gmail.com',
    github: 'https://github.com/Taseen007',
    photo: TaseenImg,
  },
];

const Card = ({ person }) => {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-4 sm:p-5 flex items-center sm:block gap-4">
      <img
        src={person.photo}
        alt={person.name}
        loading="lazy"
        className="w-20 h-24 sm:w-full sm:h-60 object-cover object-top rounded-lg"
      />
      <div className="min-w-0 sm:mt-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{person.name}</h3>
        <p className="text-sm text-gray-500">{person.role}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <a href={`mailto:${person.email}`} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">Email</a>
          {person.linkedin && (
            <a href={person.linkedin} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-full bg-[#0a66c2]/10 text-[#0a66c2] hover:bg-[#0a66c2]/20">LinkedIn</a>
          )}
          {person.github && (
            <a href={person.github} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-full bg-gray-900 text-white hover:opacity-90">GitHub</a>
          )}
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  return (
    <div className="py-8 md:py-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Contact Us</h1>
        <p className="mt-3 text-gray-600">Reach out to our team for collaboration, feedback, or support.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {people.map((p) => (
          <Card key={p.name} person={p} />
        ))}
      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        Prefer email? <a href="mailto:adibrahman44@gmail.com" className="text-emerald-600 hover:underline">adibrahman44@gmail.com</a>
      </div>

      <div className="mt-8 text-center">
        <Link to="/faqs" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">Visit FAQs</Link>
      </div>
    </div>
  );
};

export default Contact;

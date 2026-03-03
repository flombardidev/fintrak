function Card({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-sm text-gray-500">{title}</h2>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default Card;

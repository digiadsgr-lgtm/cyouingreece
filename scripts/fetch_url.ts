async function run() {
  const res = await fetch('https://cyouingreece.vercel.app/destination/santorini');
  console.log('Status:', res.status);
  const text = await res.text();
  console.log(text.substring(0, 1000));
}
run();

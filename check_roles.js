
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bsktvjlmgctjkafesold.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJza3R2amxtZ2N0amthZmVzb2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDcwODgsImV4cCI6MjA4ODM4MzA4OH0.VrpguIvT5pNlK9pFRKYAwXQvnvcYvssrjA8Vx-pgTtk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }
  
  console.log('Profiles data (JSON):');
  console.log(JSON.stringify(data, null, 2));
}

checkProfiles();

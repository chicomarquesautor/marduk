update public.characters set image_url = '/images/characters/' || slug || '.jpg'
where slug in ('helena-varga','teodoro-varga','dra-ines-salles','marduk');
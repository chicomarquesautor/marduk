create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid());

create or replace function public.assign_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created_assign_admin
  after insert on auth.users for each row execute function public.assign_first_admin();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  category text not null default 'Atualização',
  cover_url text,
  published boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.posts to anon;
grant select, insert, update, delete on public.posts to authenticated;
grant all on public.posts to service_role;
alter table public.posts enable row level security;
create policy "Anyone reads published posts" on public.posts for select to anon, authenticated
  using (published = true);
create policy "Admin reads all posts" on public.posts for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admin inserts posts" on public.posts for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin updates posts" on public.posts for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes posts" on public.posts for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role text not null default '',
  quote text not null default '',
  summary text not null default '',
  description text not null default '',
  image_url text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.characters to anon;
grant select, insert, update, delete on public.characters to authenticated;
grant all on public.characters to service_role;
alter table public.characters enable row level security;
create policy "Anyone reads visible characters" on public.characters for select to anon, authenticated
  using (published = true);
create policy "Admin reads all characters" on public.characters for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admin inserts characters" on public.characters for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin updates characters" on public.characters for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes characters" on public.characters for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create trigger characters_touch before update on public.characters for each row execute function public.touch_updated_at();

create policy "Anyone reads media" on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');
create policy "Admin uploads media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "Admin updates media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

insert into public.posts (slug, title, excerpt, content, category, published, published_at) values
('o-primeiro-sonho',
 'O primeiro sonho',
 'Marduk nasceu de um sonho que tive três noites seguidas. Sobre o começo de tudo.',
 E'Durante anos tentei escrever histórias com criaturas, casas assombradas, vultos no fim do corredor. Nenhuma delas me assustava de verdade.\n\nO que me tira o sono é outra coisa: a dúvida. A sensação de que a memória pode mentir, de que um sonho pode deixar marcas no mundo acordado — ou de que talvez nunca tenhamos acordado de fato.\n\n## A primeira imagem\n\nTudo começou com um sonho que se repetiu três noites seguidas: um homem sem rosto, de pé no fim de um corredor, dizendo um nome que eu não conhecia. **Marduk.**\n\nNa quarta noite, comecei a anotar. As anotações viraram o primeiro capítulo, e o primeiro capítulo virou uma pergunta que ainda não sei responder.\n\n> O medo verdadeiro não grita. Ele sussurra, e espera você concordar.\n\nNeste diário vou registrar o processo: as decisões, os cortes, as dúvidas e os personagens que insistem em mudar de ideia sem me avisar.',
 'Processo criativo', true, now() - interval '21 days'),
('narrador-nao-confiavel',
 'A decisão do narrador não confiável',
 'Reescrevi os seis primeiros capítulos em primeira pessoa, em forma de diário. Explico o porquê — e o que perdi no caminho.',
 E'A primeira versão era narrada em terceira pessoa. Funcionava, mas mantinha o leitor seguro, do lado de fora do vidro.\n\nDecidi quebrar o vidro. O livro agora é o próprio diário de sonhos da protagonista.\n\n## O que mudou\n\n- O leitor só sabe o que ela **acredita** ter sonhado.\n- Algumas entradas do diário se contradizem de propósito — e cabe a quem lê decidir qual versão é real.\n- Cortei quase 20 páginas de explicação que, sinceramente, tiravam o medo de tudo.\n\n## O que perdi\n\nPerdi os capítulos do ponto de vista do irmão. Eram bons. Talvez voltem, talvez virem um conto à parte. Por enquanto, estão guardados numa pasta chamada *coisas que ela não pode ver*.',
 'Decisões', true, now() - interval '9 days'),
('diario-de-revisao-1',
 'Diário de revisão #1',
 'Primeira leitura completa do manuscrito. 84 mil palavras, três buracos na trama e um final que ainda não me convence.',
 E'Terminei a primeira leitura completa do manuscrito. Alguns números:\n\n- **84.200 palavras**\n- **31 entradas de diário** (eram 34)\n- **3 buracos de trama** anotados em vermelho\n\nO ritmo do segundo ato está arrastado. Há um trecho inteiro na casa de veraneio que precisa ser mais curto e mais estranho — mais parecido com um sonho, menos com uma descrição.\n\nO final ainda não me convence. Ele responde perguntas demais. Um bom terror psicológico deveria deixar o leitor com uma pergunta a mais do que tinha no começo.\n\nPróximo passo: reescrever a entrada 22 e testar um final mais aberto.',
 'Atualização', true, now() - interval '2 days');

insert into public.characters (slug, name, role, quote, summary, description, sort_order) values
('helena-varga', 'Helena Varga', 'Protagonista',
 'Eu sei o que sonhei. Só não sei se aconteceu.',
 'Restauradora de fotografias que começa a registrar os sonhos num diário — até perceber que eles estão vazando para o mundo acordado.',
 E'Helena tem 34 anos e trabalha sozinha num ateliê no último andar de um prédio antigo. É metódica, silenciosa e desconfiada de qualquer coisa que não possa examinar com uma lupa.\n\nDesde a morte da mãe, acorda todas as noites às 3h17, com um nome na boca. No começo, achava que era insônia. Depois, objetos do sonho começaram a aparecer no apartamento — sempre pequenos, sempre o suficiente para ela duvidar de si mesma.\n\n## Por que ela existe\n\nHelena nasceu da pergunta: *o que acontece quando a única testemunha de um crime é alguém em quem nem ela mesma confia?*',
 1),
('teodoro-varga', 'Teodoro Varga', 'O irmão',
 'Você sempre lembrou das coisas do jeito que queria.',
 'Irmão mais velho de Helena. Gentil, prestativo — e o único que parece saber o que aconteceu naquela casa.',
 E'Teodoro cuidou de Helena depois da morte do pai e ainda age como se ela fosse a menina de dez anos que precisava ser protegida.\n\nÉ o personagem que mais mudou durante a escrita. Na primeira versão, era um vilão óbvio. Agora, nem eu tenho certeza do que ele quer.',
 2),
('dra-ines-salles', 'Dra. Inês Salles', 'A psiquiatra',
 'Vamos voltar ao começo. Me conte o sonho de novo.',
 'Psiquiatra de Helena. Calma, paciente e estranhamente interessada no diário.',
 E'Inês atende Helena há oito meses. Suas sessões são o lugar onde a narrativa tenta se organizar — e onde, aos poucos, as perguntas da médica começam a soar menos como terapia e mais como um interrogatório.\n\nInspirada em um livro de casos clínicos dos anos 70 que encontrei num sebo, com anotações a lápis nas margens.',
 3),
('marduk', 'Marduk', 'Presença',
 '—',
 'Um homem sem rosto, sempre no fim de um corredor. Aparece nos sonhos de Helena — e, às vezes, fora deles.',
 E'Ele não fala. Não se aproxima. Só está lá.\n\nO nome vem de um deus babilônico que venceu o caos e deu forma ao mundo. No livro, Marduk faz o contrário: desfaz a forma das coisas, uma noite de cada vez.\n\nÉ o único personagem cuja história eu decidi **não** escrever por completo. Algumas coisas ficam mais assustadoras quando não têm explicação.',
 4);
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.2 (Debian 16.2-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.authors (
    author_id integer NOT NULL,
    name character varying(255) NOT NULL,
    ministry character varying(255) NOT NULL,
    image_path text
);


ALTER TABLE public.authors OWNER TO root;

--
-- Name: author_author_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.author_author_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.author_author_id_seq OWNER TO root;

--
-- Name: author_author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.author_author_id_seq OWNED BY public.authors.author_id;


--
-- Name: series; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.series (
    series_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    image_path text,
    num_of_eps smallint NOT NULL
);


ALTER TABLE public.series OWNER TO root;

--
-- Name: series_series_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.series_series_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.series_series_id_seq OWNER TO root;

--
-- Name: series_series_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.series_series_id_seq OWNED BY public.series.series_id;


--
-- Name: sermons; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.sermons (
    sermon_id integer NOT NULL,
    title character varying(255) NOT NULL,
    date_delivered date NOT NULL,
    audio_link text NOT NULL,
    author_id integer NOT NULL,
    series_id integer NOT NULL,
    scripture character varying(255),
    description text,
    image text
);


ALTER TABLE public.sermons OWNER TO root;

--
-- Name: sermons_sermon_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.sermons_sermon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sermons_sermon_id_seq OWNER TO root;

--
-- Name: sermons_sermon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.sermons_sermon_id_seq OWNED BY public.sermons.sermon_id;


--
-- Name: authors author_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.authors ALTER COLUMN author_id SET DEFAULT nextval('public.author_author_id_seq'::regclass);


--
-- Name: series series_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.series ALTER COLUMN series_id SET DEFAULT nextval('public.series_series_id_seq'::regclass);


--
-- Name: sermons sermon_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.sermons ALTER COLUMN sermon_id SET DEFAULT nextval('public.sermons_sermon_id_seq'::regclass);


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.authors (author_id, name, ministry, image_path) FROM stdin;
71	Test Auhtor	Test Ministry	sermons/author/Test Auhtor/image/sea-2604840_1280.jpg
\.


--
-- Data for Name: series; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.series (series_id, title, description, image_path, num_of_eps) FROM stdin;
12	Test Seires	Test Description	sermons/series/Test Seires/image/sea-2604840_1280.jpg	0
\.


--
-- Data for Name: sermons; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.sermons (sermon_id, title, date_delivered, audio_link, author_id, series_id, scripture, description, image) FROM stdin;
1	a	2024-02-01	sermons/sermons/a/audio/FBCTV_Paul_1_28_24.mp3	71	12	a	\N	\N
2	a	2024-02-01	sermons/sermons/a/audio/FBCTV_Paul_1_28_24.mp3	71	12	a	\N	\N
3	a	2024-02-01	sermons/sermons/a/audio/FBCTV_Paul_1_28_24.mp3	71	12	a	\N	\N
4	a	2024-02-01	sermons/sermons/a/audio/FBCTV_Paul_1_28_24.mp3	71	12	a	\N	\N
5	a	2024-02-01	sermons/sermons/a/audio/FBCTV_Paul_1_28_24.mp3	71	12	a	\N	\N
6	a	2024-02-01	sermons/sermons/a/audio/FBCTV_Paul_1_28_24.mp3	71	12	a	\N	\N
7	a	2024-02-01	sermons/sermons/a/audio/FBCTV_Paul_1_28_24.mp3	71	12	a	\N	\N
8	a	2024-02-01	sermons/sermons/a/audio/FBCTV_Paul_1_28_24.mp3	71	12	a	\N	\N
\.


--
-- Name: author_author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.author_author_id_seq', 71, true);


--
-- Name: series_series_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.series_series_id_seq', 12, true);


--
-- Name: sermons_sermon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.sermons_sermon_id_seq', 8, true);


--
-- Name: authors author_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT author_pkey PRIMARY KEY (author_id);


--
-- Name: series series_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_pkey PRIMARY KEY (series_id);


--
-- Name: sermons sermons_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.sermons
    ADD CONSTRAINT sermons_pkey PRIMARY KEY (sermon_id);


--
-- Name: sermons sermons_series_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.sermons
    ADD CONSTRAINT sermons_series_id_fkey FOREIGN KEY (series_id) REFERENCES public.series(series_id);


--
-- PostgreSQL database dump complete
--


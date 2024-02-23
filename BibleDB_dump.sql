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
72	Jeff Price	Faith Bible Church Treasure Valley	sermons/author/Jeff Price/image/JeffDanielle+photo.jpg
73	Paul Rust	Faith Bible Church Treasure Valley	sermons/author/Paul Rust/image/PaulElaine+photo.jpg
\.


--
-- Data for Name: series; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.series (series_id, title, description, image_path, num_of_eps) FROM stdin;
13	Stand Firm	A Study of the Book of First Peter	sermons/series/Stand Firm/image/1+Peter+Sermon+image.jpg	0
14	Jonah	A Study of the Book of Jonah	sermons/series/Jonah/image/Jonah+graphic.jpg	0
15	Foundations of a Healthy Church	How to have a Bible Centered Church	sermons/series/Foundations of a Healthy Church/image/gettyimages-157610088-612x612.jpg	0
\.


--
-- Data for Name: sermons; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.sermons (sermon_id, title, date_delivered, audio_link, author_id, series_id, scripture, description, image) FROM stdin;
9	The Purpose of the Church	2023-12-03	sermons/sermons/The Purpose of the Church/audio/The Purpose of the Church - Jeff Price.mp3	72	15	Various Scriptures	\N	\N
10	The Building Blocks of a Healthy Church	2023-12-10	sermons/sermons/The Building Blocks of a Healthy Church/audio/The Building Blocks of a Healthy Church.mp3	72	15	Various Scriptures	\N	\N
11	The Marks of a Genuine Believer	2023-12-10	sermons/sermons/The Marks of a Genuine Believer/audio/The Marks of a Genuine Believer.mp3	72	15	Various Scriptures	\N	\N
12	Intro to 1 Peter	2023-12-10	sermons/sermons/Intro to 1 Peter/audio/Standing Firm-Intro to 1 Peter.mp3	72	13	1 Peter	\N	\N
13	Chosen for a Purpose	2023-12-10	sermons/sermons/Chosen for a Purpose/audio/Chosen for a Purpose.mp3	72	13	1 Peter	\N	\N
14	The Purposeful Life of Peter	2023-12-10	sermons/sermons/The Purposeful Life of Peter/audio/The Purposeful Life of Peter.mp3	72	13	1 Peter	\N	\N
15	Our Saving God	2024-02-15	sermons/sermons/Our Saving God/audio/Our Saving God.mp3	73	14	Jonah	\N	\N
16	Our Remarkable God	2024-02-25	sermons/sermons/Our Remarkable God/audio/Our Remarkable God.mp3	73	14	Jonah	\N	\N
\.


--
-- Name: author_author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.author_author_id_seq', 73, true);


--
-- Name: series_series_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.series_series_id_seq', 15, true);


--
-- Name: sermons_sermon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.sermons_sermon_id_seq', 16, true);


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


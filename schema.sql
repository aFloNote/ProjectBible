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

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.authors (
    name character varying(255) NOT NULL,
    ministry character varying(255) NOT NULL,
    image_path character varying NOT NULL,
    author_id uuid NOT NULL,
    bio_link character varying DEFAULT 'default'::character varying,
    slug character varying NOT NULL
);


ALTER TABLE public.authors OWNER TO root;

--
-- Name: scriptures; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.scriptures (
    scripture_id uuid NOT NULL,
    book character varying NOT NULL,
    image_path character varying NOT NULL,
    slug character varying NOT NULL
);


ALTER TABLE public.scriptures OWNER TO root;

--
-- Name: series; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.series (
    title character varying(255) NOT NULL,
    description text,
    image_path character varying,
    series_id uuid NOT NULL,
    date_published timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    slug character varying NOT NULL
);


ALTER TABLE public.series OWNER TO root;

--
-- Name: sermons; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.sermons (
    title character varying(255) NOT NULL,
    date_delivered date NOT NULL,
    audio_path character varying NOT NULL,
    scripture character varying(255) NOT NULL,
    description character varying DEFAULT 'default'::character varying NOT NULL,
    image character varying DEFAULT 'default'::character varying NOT NULL,
    sermon_id uuid NOT NULL,
    series_id uuid NOT NULL,
    author_id uuid NOT NULL,
    slug character varying NOT NULL,
    topic_id uuid NOT NULL,
    scripture_id uuid NOT NULL
);


ALTER TABLE public.sermons OWNER TO root;

--
-- Name: topics; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.topics (
    image_path character varying DEFAULT 'noimage'::character varying,
    name character varying NOT NULL,
    topic_id uuid NOT NULL,
    slug character varying NOT NULL
);


ALTER TABLE public.topics OWNER TO root;

--
-- Name: authors authors_pk; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pk PRIMARY KEY (author_id);


--
-- Name: scriptures scriptures_pk; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.scriptures
    ADD CONSTRAINT scriptures_pk PRIMARY KEY (scripture_id);


--
-- Name: series series_pk; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_pk PRIMARY KEY (series_id);


--
-- Name: sermons sermons_pk; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.sermons
    ADD CONSTRAINT sermons_pk PRIMARY KEY (sermon_id);


--
-- Name: topics topics_pk; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pk PRIMARY KEY (topic_id);


--
-- Name: sermons author_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.sermons
    ADD CONSTRAINT author_id FOREIGN KEY (author_id) REFERENCES public.authors(author_id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: sermons scripture_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.sermons
    ADD CONSTRAINT scripture_id FOREIGN KEY (scripture_id) REFERENCES public.scriptures(scripture_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sermons series_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.sermons
    ADD CONSTRAINT series_id FOREIGN KEY (series_id) REFERENCES public.series(series_id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: sermons topic_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.sermons
    ADD CONSTRAINT topic_id FOREIGN KEY (topic_id) REFERENCES public.topics(topic_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TABLE authors; Type: ACL; Schema: public; Owner: root
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.authors TO faithbible;


--
-- Name: TABLE scriptures; Type: ACL; Schema: public; Owner: root
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.scriptures TO faithbible;


--
-- Name: TABLE series; Type: ACL; Schema: public; Owner: root
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.series TO faithbible;


--
-- Name: TABLE sermons; Type: ACL; Schema: public; Owner: root
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.sermons TO faithbible;


--
-- Name: TABLE topics; Type: ACL; Schema: public; Owner: root
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.topics TO faithbible;


--
-- PostgreSQL database dump complete
--

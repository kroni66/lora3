  useEffect(() => {
    const handleResize = () => drawWheel(wheelRef.current);
    drawWheel(wheelRef.current);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


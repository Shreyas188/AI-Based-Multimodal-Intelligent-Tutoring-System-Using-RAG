# Chapter 2 content data structures
# Electrostatic Potential and Capacitance

CHAPTER_2_TOPICS = [
    {
        "topic_no": 1,
        "title": "Introduction to Electrostatic Potential and Potential Energy",
        "explanation": (
            "When we lift an object against gravity, we do work on it, and this work is stored as gravitational potential energy. "
            "Similarly, in electrostatics, when we move a charge against the repulsive electric force of another charge, we do work. "
            "This work done by external force is stored as electrostatic potential energy (U). "
            "Electrostatic potential energy is the energy a charge possesses by virtue of its position in an electric field.\n\n"
            "Formula for potential energy of two point charges q1 and q2 separated by distance r:\n"
            "U = 1/(4πε0) × q1q2/r"
        ),
        "image_description": (
            "An educational diagram showing a large positive source charge Q at the origin. "
            "A smaller test charge q is shown being pushed by an external force from a far point A towards a near point B against the repulsive electric force. "
            "Clear force vectors indicating Electric Force (Fe) pointing away from Q and External Force (Fext) pointing towards Q."
        ),
        "real_life_examples": [
            "Rubbing a plastic comb in hair builds up charge; when held near paper pieces, the stored electrostatic potential energy converts to kinetic energy to pull them up.",
            "A camera flash uses a capacitor to store electric potential energy and then discharges it rapidly to create a bright flash.",
            "Lifting a balloon rubbed on a woollen sweater close to a wall, where the potential energy keeps it stuck to the wall."
        ],
        "important_points": [
            "Electrostatic potential energy depends on the positions of the charges in the field.",
            "Work done by an external force in moving charge q from A to B is equal to change in potential energy (UB - UA).",
            "Potential energy of a system is zero when charges are infinitely far apart.",
            "SI unit of electrostatic potential energy is Joule (J).",
            "It is a scalar quantity."
        ],
        "board_exam_tip": "Remember that work done by the electric field is negative of the change in potential energy: Wel = -(UB - UA) = -ΔU.",
        "quick_recap": [
            "Work done in moving charge in electric field stores as potential energy.",
            "U = 1/(4πε0) * q1q2/r for two point charges.",
            "Potential energy is zero at infinity."
        ],
        "reference_link": "https://www.youtube.com/watch?v=XzWCoqJ5tQ0"
    },
    {
        "topic_no": 2,
        "title": "Conservative Nature of Electrostatic Force",
        "explanation": (
            "A force is said to be conservative if the work done by it in moving a particle from one point to another depends only on the initial and final positions and is completely independent of the path taken. "
            "Coulomb's law force between charges is a conservative force, just like gravity. "
            "This means if you move a test charge from point A to point B in an electric field, the work done is exactly the same whether you take a straight line path, a curved path, or a zig-zag path. "
            "As a result, the work done by electrostatic force in moving a charge along any closed loop (returning to the starting point) is always zero."
        ),
        "image_description": (
            "A diagram showing two points, A and B, in space with three distinct paths connecting them (Path 1: straight, Path 2: curved, Path 3: loop-like). "
            "A test charge 'q' is shown on the paths, with the label 'Work Done (W1 = W2 = W3)' to emphasize path independence."
        ),
        "real_life_examples": [
            "Moving a test charge around a closed square track in an electric field returns it to the starting point with net work done being zero.",
            "In an electrical circuit, if a charge completes a full loop through a resistor and battery back to its starting node, the sum of potential changes is zero (Kirchhoff's Loop Rule).",
            "A roller coaster returning to the station: the net work done by gravity is zero, matching the path independence of conservative fields."
        ],
        "important_points": [
            "Electrostatic force is conservative in nature.",
            "Work done is independent of the path between two points.",
            "Work done in a closed path is zero (∮ E · dl = 0).",
            "This property allows us to define a unique potential at each point in the field.",
            "Non-conservative forces (like friction) do not have this path independence."
        ],
        "board_exam_tip": "If a board question asks you to prove electrostatic force is conservative, state that the work done along a closed path is zero: ∮ E · dl = 0.",
        "quick_recap": [
            "Electrostatic force is conservative.",
            "Work done depends only on initial and final points.",
            "Work done in any closed loop is zero."
        ],
        "reference_link": "https://www.khanacademy.org/science/physics/work-and-energy/work-and-energy-tutorial/v/conservative-forces"
    },
    {
        "topic_no": 3,
        "title": "Electrostatic Potential",
        "explanation": (
            "Electrostatic potential (V) at any point in an electric field is defined as the work done by an external agent in bringing a unit positive charge from infinity to that point without acceleration. "
            "While potential energy depends on the test charge, potential is a property of the field itself. "
            "If we know the potential V at a point, the potential energy U of a charge q placed at that point is simply U = qV.\n"
            "Formula:\n"
            "V = W / q\n"
            "where W is the work done and q is the charge. "
            "Its SI unit is Volt (V). One Volt is equal to one Joule per Coulomb (1 V = 1 J/C)."
        ),
        "image_description": (
            "A graphic showing a unit positive charge (+1 C) traveling from a cloud labeled 'Infinity (∞)' to a point 'P' inside the electric field of a source charge +Q. "
            "The potential V at point P is labeled as V = W/q."
        ),
        "real_life_examples": [
            "A standard AA battery has a potential of 1.5 V, meaning it can do 1.5 Joules of work for every Coulomb of charge passing from one terminal to another.",
            "A high-voltage power transmission line has a potential of thousands of volts, meaning charges carry immense energy relative to the ground.",
            "Static shock from a metal doorknob after walking on carpet can involve potentials of over 5,000 Volts, though the total charge is tiny."
        ],
        "important_points": [
            "Electrostatic potential is a scalar quantity.",
            "V = W / q is the defining equation.",
            "SI unit is Volt (V), named after Alessandro Volta.",
            "Potential at infinity is conventionally taken to be zero.",
            "It measures the 'electrical state' of a point in space."
        ],
        "board_exam_tip": "State the definition of 1 Volt: 'Potential at a point is 1 Volt if 1 Joule of work is done in bringing 1 Coulomb of positive charge from infinity to that point.'",
        "quick_recap": [
            "Potential is work done per unit positive charge from infinity.",
            "V = W/q.",
            "Scalar quantity, unit is Volt (1 V = 1 J/C)."
        ],
        "reference_link": "https://www.youtube.com/watch?v=wT9goXhRkGw"
    },
    {
        "topic_no": 4,
        "title": "Potential Difference",
        "explanation": (
            "Potential difference between two points A and B in an electric field is the work done in moving a unit positive charge from point A to point B without acceleration. "
            "It is the difference in the electrostatic potentials of the two points. "
            "Just like water flows from high pressure to low pressure, positive charges naturally flow from higher potential to lower potential.\n"
            "Formula:\n"
            "ΔV = VB - VA = WAB / q\n"
            "where WAB is the work done by an external force to move charge q from A to B."
        ),
        "image_description": (
            "A diagram showing two points, A (at low potential VA) and B (at high potential VB) in an electric field. "
            "A positive test charge is shown moving from A to B with a work arrow labeled 'WAB'. "
            "An analogy diagram of two water tanks at different heights showing water flowing from high to low level is placed next to it."
        ),
        "real_life_examples": [
            "Electrical current flows through a light bulb only when there is a potential difference between its two terminals.",
            "A household wall socket provides a potential difference of 220 V (or 110 V), driving appliances by moving charges.",
            "During lightning, a massive potential difference (millions of volts) builds up between clouds and the ground, causing air breakdown."
        ],
        "important_points": [
            "Potential difference drives electric current in circuits.",
            "Positive charges move from high potential to low potential.",
            "Negative charges move from low potential to high potential.",
            "It is measured in Volts (V) using a voltmeter connected in parallel.",
            "Like potential, it is a scalar quantity."
        ],
        "board_exam_tip": "Note that voltmeters are always connected in parallel because they measure the potential difference between two distinct nodes.",
        "quick_recap": [
            "Potential difference is VB - VA = WAB / q.",
            "Positive charges naturally flow from high to low potential.",
            "Measured in Volts."
        ],
        "reference_link": "https://www.youtube.com/watch?v=F1pY894M2Pg"
    },
    {
        "topic_no": 5,
        "title": "Potential Due to a Point Charge",
        "explanation": (
            "The electrostatic potential at a distance r from a single isolated point charge Q is the work done in bringing a unit positive charge from infinity to that distance. "
            "Unlike the electric field which decreases with the square of the distance (1/r²), the potential decreases linearly with distance (1/r).\n"
            "Formula:\n"
            "V = 1/(4πε0) × Q/r\n"
            "Here, ε0 is permittivity of free space. "
            "If Q is positive, potential V is positive. If Q is negative, potential V is negative. "
            "This shows that positive charges create positive potential fields, while negative charges create negative potential fields."
        ),
        "image_description": (
            "A graph comparing Electric Field (E) and Electric Potential (V) against distance (r) from a point charge. "
            "The E-curve (proportional to 1/r²) falls off much faster than the V-curve (proportional to 1/r). "
            "Both axes are clearly labeled."
        ),
        "real_life_examples": [
            "The potential around a hydrogen atom nucleus (a single proton) decreases as you move further away, which determines the energy levels of the electron.",
            "A van de Graaff generator dome acts as a single point charge at large distances, with the electric potential dropping as 1/r as you step back.",
            "Industrial paint sprayers use a highly charged nozzle (point charge behavior) to create a potential field that guides paint droplets to a grounded target."
        ],
        "important_points": [
            "Potential is spherically symmetric around a point charge (depends only on distance r).",
            "V is proportional to 1/r, whereas E is proportional to 1/r².",
            "V is positive for Q > 0 and negative for Q < 0.",
            "At r = infinity, V = 0.",
            "Unit is Volt (V)."
        ],
        "board_exam_tip": "Keep in mind that the sign of the charge MUST be included when calculating potential (V = kQ/r), unlike electric field where we only use the magnitude.",
        "quick_recap": [
            "V = 1/(4πε0) * Q/r.",
            "V decays as 1/r.",
            "Include charge sign in calculations."
        ],
        "reference_link": "https://www.youtube.com/watch?v=2Tz89Z4l4_Q"
    },
    {
        "topic_no": 6,
        "title": "Potential Due to an Electric Dipole",
        "explanation": (
            "An electric dipole consists of two equal and opposite charges (+q and -q) separated by a small distance 2a. "
            "The potential at any point P (at distance r and angle θ from the dipole axis) is the sum of the potentials due to individual charges. "
            "At large distances, the potential due to a dipole falls off faster (1/r²) than that due to a point charge (1/r).\n"
            "Formula:\n"
            "V = 1/(4πε0) × p cosθ / r²\n"
            "where p = q × 2a is the electric dipole moment. "
            "Note that:\n"
            "1. On the axial line (θ = 0° or 180°), potential is maximum: V = ± 1/(4πε0) × p/r².\n"
            "2. On the equatorial line (θ = 90°), potential is zero: V = 0 because cos(90°) = 0."
        ),
        "image_description": (
            "A diagram showing a dipole (-q at A and +q at B) separated by 2a. "
            "A point P is shown at distance r from the center O making an angle θ with the dipole axis. "
            "Equations for axial and equatorial cases are highlighted in a box."
        ),
        "real_life_examples": [
            "Water molecule (H2O) is a polar molecule (dipole); its potential field at large distances dictates how it interacts with other polar substances like salts.",
            "A heart beating creates a moving electric dipole; Electrocardiogram (ECG) sensors measure the resulting potential differences across the chest.",
            "Antennas in communications use oscillating dipoles to transmit electromagnetic waves through shifting potential fields."
        ],
        "important_points": [
            "Dipole potential falls off as 1/r² at large distances.",
            "It depends not just on distance r, but also on angle θ between position vector and dipole moment vector.",
            "Potential is zero at any point on the perpendicular bisector (equatorial plane).",
            "Potential is maximum along the dipole axis.",
            "Dipole moment vector p points from -q to +q."
        ],
        "board_exam_tip": "A very common 1-mark question asks: 'What is the potential at any point on the equatorial line of an electric dipole?' The answer is always zero.",
        "quick_recap": [
            "V = 1/(4πε0) * p cosθ / r².",
            "Decays as 1/r².",
            "Equatorial line potential is zero."
        ],
        "reference_link": "https://www.youtube.com/watch?v=D6Dq7yU2p8U"
    },
    {
        "topic_no": 7,
        "title": "Potential Due to a System of Charges",
        "explanation": (
            "Electric potential is a scalar quantity. "
            "Therefore, by the principle of superposition, the net potential at any point due to a group of point charges is the algebraic sum of the potentials due to individual charges at that point. "
            "Unlike electric fields, we do not need vector addition; we simply add the potentials as ordinary numbers, keeping the signs of the charges intact.\n"
            "Formula:\n"
            "V = V1 + V2 + V3 + ... = Σ 1/(4πε0) × qi/ri\n"
            "where ri is the distance of charge qi from the point where potential is being calculated."
        ),
        "image_description": (
            "A diagram showing multiple point charges (q1, q2, q3, q4) scattered in space with dotted lines connecting them to a single point P. "
            "The distance of each charge is labeled as r1, r2, r3, r4. "
            "The sum equation Vp = V1 + V2 + V3 + V4 is shown."
        ),
        "real_life_examples": [
            "A cluster of ions in a salt solution generates a combined electrical potential at a nearby water molecule, dictating hydration dynamics.",
            "In electronic chips, multiple transistors carry charges that combine to create complex potential distributions inside the silicon.",
            "In electrostatic air filters, multiple charged wires generate a combined potential field to pull dust particles from air stream."
        ],
        "important_points": [
            "Superposition principle applies directly to electric potential.",
            "Potentials are added algebraically because they are scalars.",
            "Sign of each charge must be substituted in the calculation.",
            "This makes potential calculation much simpler than electric field calculations.",
            "If the sum is zero, it means positive potentials cancel out negative potentials."
        ],
        "board_exam_tip": "When calculating net potential, write the algebraic sum explicitly and substitute negative charges with a negative sign.",
        "quick_recap": [
            "V = Σ 1/(4πε0) * qi/ri.",
            "Scalar summation (direct algebraic addition).",
            "Include signs of charges."
        ],
        "reference_link": "https://www.youtube.com/watch?v=p4v31H7Hw04"
    },
    {
        "topic_no": 8,
        "title": "Potential Due to Continuous Charge Distribution",
        "explanation": (
            "If a charge is distributed continuously over a region (rather than as point charges), we divide the charge distribution into infinite infinitesimal charge elements dq. "
            "The potential due to each element dq is dV = 1/(4πε0) × dq/r. "
            "The total potential is found by integrating this expression over the entire charge distribution.\n"
            "Formula:\n"
            "V = ∫ 1/(4πε0) × dq/r\n"
            "Depending on distribution, we use:\n"
            "1. Linear charge density (λ): dq = λ dl\n"
            "2. Surface charge density (σ): dq = σ dS\n"
            "3. Volume charge density (ρ): dq = ρ dV"
        ),
        "image_description": (
            "An infographic showing three types of distributions: a charged wire (linear), a charged sheet (surface), and a charged sphere (volume). "
            "Each has a small element highlighted (dq) with a distance r pointing to a point P, showing the corresponding integral formula."
        ),
        "real_life_examples": [
            "A long power line carrying linear charge creates a potential field that drops off logarithmically with radial distance.",
            "A charged metal disk in laboratory equipment creates a potential field along its central axis.",
            "The earth itself behaves as a giant sphere with surface charge density, creating an electric potential gradient in the atmosphere."
        ],
        "important_points": [
            "Continuous charge requires integration instead of summation.",
            "Integrate dV = dq / (4πε0 r) over the entire charge body.",
            "Linear density λ is charge per unit length (C/m).",
            "Surface density σ is charge per unit area (C/m²).",
            "Volume density ρ is charge per unit volume (C/m³)."
        ],
        "board_exam_tip": "For a charged ring of radius R, the potential at a point on its axis at distance x is V = 1/(4πε0) × Q / √(R² + x²). At center, V = Q / (4πε0 R). Remember this formula.",
        "quick_recap": [
            "V = ∫ 1/(4πε0) * dq/r.",
            "Uses λ (linear), σ (surface), or ρ (volume) charge densities.",
            "Ring axial potential: V = kQ / √(R² + x²)."
        ],
        "reference_link": "https://www.youtube.com/watch?v=wH-BvXb9aT4"
    },
    {
        "topic_no": 9,
        "title": "Equipotential Surfaces",
        "explanation": (
            "An equipotential surface is any surface over which the electrostatic potential is constant at every point. "
            "Because the potential difference between any two points on an equipotential surface is zero, no work is done in moving a charge along it. "
            "Crucially, the electric field lines are always perpendicular (at 90 degrees) to the equipotential surface at every point. "
            "If they were not, there would be a component of the field along the surface, which would require work to move a charge, violating the definition of an equipotential surface."
        ),
        "image_description": (
            "A beautiful representation of equipotential lines (concentric circles) around a positive point charge. "
            "Electric field lines are drawn as outward arrows perpendicular to the circles, showing 90-degree angle markers at intersections."
        ),
        "real_life_examples": [
            "A metal sheet connected to a battery terminal has the same electrical potential everywhere on its surface, making it an equipotential surface.",
            "Topographical maps use contour lines to show points of equal height (gravitational potential); equipotential lines are the exact electrical equivalent.",
            "A bird sitting on a high-voltage wire does not get shocked because both its feet are on the same wire (equipotential surface, no potential difference)."
        ],
        "important_points": [
            "Potential is constant at all points on an equipotential surface.",
            "No work is done in moving a charge on this surface (W = q × ΔV = 0).",
            "Electric field is always perpendicular to the surface at every point.",
            "Equipotential surfaces are close together in regions of strong fields and far apart in weak fields.",
            "Two equipotential surfaces can never intersect (otherwise a single point would have two different potentials)."
        ],
        "board_exam_tip": "Draw equipotential surfaces for: (a) single point charge (concentric spheres), (b) uniform electric field (parallel planes perpendicular to field lines). These are frequently asked in drawing questions.",
        "quick_recap": [
            "Equipotential surface: V is constant everywhere.",
            "Work done on it is zero (W = 0).",
            "E-field lines are always perpendicular. Surfaces never intersect."
        ],
        "reference_link": "https://www.youtube.com/watch?v=2T9Co9zO4g0"
    },
    {
        "topic_no": 10,
        "title": "Relation Between Electric Field and Potential",
        "explanation": (
            "Electric field (E) and electric potential (V) are two different ways of describing the same electrical environment. "
            "The relation between them is that the electric field is the negative gradient of potential. "
            "This means the electric field points in the direction of the steepest decrease in potential, and its magnitude is given by the change in potential per unit distance perpendicular to the equipotential surface.\n"
            "Formula:\n"
            "E = -dV/dr\n"
            "The negative sign indicates that the direction of the electric field is always in the direction of decreasing potential."
        ),
        "image_description": (
            "A graphic showing a potential dropping from 30V to 20V to 10V from left to right. "
            "Electric field vectors E are drawn pointing to the right, showing they point from high potential to low potential. "
            "The formula E = -dV/dr is shown prominently."
        ),
        "real_life_examples": [
            "A steep mountain slope has a high height gradient (rapid change in gravitational potential), corresponding to a stronger gravitational pull downwards.",
            "In circuits, electrical field lines inside wires point from the positive terminal (high potential) to the negative terminal (low potential), driving current.",
            "Spark plugs in cars use a very high potential difference over a tiny gap (high dV/dr) to create an electric field strong enough to ionize air and spark."
        ],
        "important_points": [
            "Electric field points in the direction where potential decreases steepest.",
            "Magnitude of E is change in V per unit displacement.",
            "E = -dV/dr (potential gradient).",
            "For a uniform electric field, the relation simplifies to E = V/d.",
            "Unit of electric field can also be written as Volt per meter (V/m), which is equivalent to N/C."
        ],
        "board_exam_tip": "If V = 4x² Volts, find E at x = 2m. E = -dV/dx = -d(4x²)/dx = -8x. At x = 2, E = -16 V/m. Remember to differentiate and apply the negative sign.",
        "quick_recap": [
            "E = -dV/dr.",
            "Field points in direction of decreasing potential.",
            "Unit is V/m or N/C."
        ],
        "reference_link": "https://www.youtube.com/watch?v=F_fEaU1e52k"
    },
    {
        "topic_no": 11,
        "title": "Potential Energy of a System of Charges",
        "explanation": (
            "The potential energy of a system of charges is defined as the work done in assembling the charges from infinity to their respective locations, keeping them at rest. "
            "For a system of two charges q1 and q2, the potential energy is simply U = 1/(4πε0) × q1q2/r12. "
            "For a system of three charges (q1, q2, q3), the total potential energy is the sum of the potential energies of all possible pairs.\n"
            "Formula for three charges:\n"
            "U = 1/(4πε0) × [ q1q2/r12 + q2q3/r23 + q1q3/r13 ]\n"
            "This pairwise summation is repeated for any number of charges in the system."
        ),
        "image_description": (
            "A triangle diagram with charges q1, q2, and q3 at the vertices. "
            "The sides are labeled as r12, r23, and r13. "
            "The total potential energy formula is shown below the triangle with arrows mapping each term to a side of the triangle."
        ),
        "real_life_examples": [
            "In a salt crystal (NaCl), the stability of the lattice depends on the total electrostatic potential energy of millions of positive Na+ and negative Cl- ions.",
            "The nucleus of a helium atom contains two protons; the electrostatic potential energy between them is positive (repulsion), which is overcome by the nuclear force.",
            "A thundercloud containing millions of charged water droplets has immense stored potential energy, which is released during a lightning strike."
        ],
        "important_points": [
            "Potential energy is a scalar quantity.",
            "Total potential energy is the sum of energies of all distinct pairs of charges.",
            "Use the formula U = k q_i q_j / r_ij for each pair.",
            "If charges have opposite signs, their pair potential energy is negative.",
            "Number of pairs for N charges is given by N(N-1)/2."
        ],
        "board_exam_tip": "For N = 4 charges (square arrangement), don't forget the diagonal pairs! The number of pairs is 4(3)/2 = 6 pairs (4 sides + 2 diagonals). Use this to avoid missing terms.",
        "quick_recap": [
            "U is the total work done to assemble charges from infinity.",
            "For three charges, U = k * (q1q2/r12 + q2q3/r23 + q1q3/r13).",
            "Calculate pairwise and sum algebraically."
        ],
        "reference_link": "https://www.youtube.com/watch?v=S8pB4W5n_m8"
    },
    {
        "topic_no": 12,
        "title": "Potential Energy in an External Electric Field",
        "explanation": (
            "If charges are placed in an external electric field E (which is produced by sources outside the system), we must account for the work done against this external field as well as the mutual interaction between the charges. "
            "For a single charge q placed in an external potential V(r), the potential energy is simply U = qV(r). "
            "For a system of two charges q1 and q2 placed in an external field at positions r1 and r2, the potential energy consists of three terms: the work done to bring q1 against the external field, the work done to bring q2 against the external field, and their mutual potential energy.\n"
            "Formula:\n"
            "U = q1 V(r1) + q2 V(r2) + 1/(4πε0) × q1q2/r12"
        ),
        "image_description": (
            "A diagram showing external electric field lines E running left to right. "
            "Two charges q1 and q2 are embedded in the field. "
            "Formula terms are color-coded to show external field interactions vs mutual interaction."
        ),
        "real_life_examples": [
            "An electron in an cathode ray tube (old TV screens) moves in an external potential field, gaining kinetic energy as its potential energy decreases.",
            "Ions in a battery's electrolyte move in response to the electric field created by the electrodes, changing their external potential energy.",
            "Protons in a particle accelerator (like the Large Hadron Collider) are accelerated by strong external electric fields using this energy conversion."
        ],
        "important_points": [
            "External field has its own potential distribution V(r).",
            "Single charge energy is U = q V.",
            "For two charges, add the energy from the external field and their mutual energy.",
            "This concept is crucial for understanding electron behavior in conductor lattices.",
            "V(r) must be known at the charge locations."
        ],
        "board_exam_tip": "If a question asks for the potential energy of a single charge in an external field, use U = qV. If V is given as a function of coordinates, substitute the coordinate values to get V.",
        "quick_recap": [
            "Single charge in external field: U = qV(r).",
            "Two charges: U = q1V(r1) + q2V(r2) + k q1q2/r12.",
            "Accounts for both external field work and mutual forces."
        ],
        "reference_link": "https://www.youtube.com/watch?v=aG9iApxZ2jM"
    },
    {
        "topic_no": 13,
        "title": "Potential Energy of a Dipole in Uniform Electric Field",
        "explanation": (
            "When an electric dipole (charges +q and -q separated by 2a) is placed in a uniform electric field E, it experiences a torque τ = p × E which aligns it with the field. "
            "If we rotate the dipole against this torque, we do work on it. "
            "This work is stored as the potential energy of the dipole. "
            "Conventionally, the potential energy is taken as zero when the dipole is perpendicular to the electric field (θ = 90°).\n"
            "Formula:\n"
            "U = -pE cosθ = -p · E\n"
            "where θ is the angle between dipole moment p and electric field E. "
            "Note that:\n"
            "1. θ = 0°: Stable equilibrium (minimum potential energy U = -pE).\n"
            "2. θ = 180°: Unstable equilibrium (maximum potential energy U = +pE)."
        ),
        "image_description": (
            "A diagram showing uniform electric field lines E. "
            "A dipole is rotated from angle 90 degrees to angle θ. "
            "Force vectors on +q (along E) and -q (opposite to E) are shown creating a torque, with stable (0°) and unstable (180°) states illustrated in inset boxes."
        ),
        "real_life_examples": [
            "In a microwave oven, water molecules (dipoles) try to align with the rapidly shifting electric field, rotating and heating food through molecular friction.",
            "Liquid Crystal Displays (LCDs) use an external electric field to rotate liquid crystal dipoles, controlling light passage to display pixels.",
            "Polar molecules in a capacitor align with the charging plates' field, storing energy in the aligned dipole configurations."
        ],
        "important_points": [
            "Dipole experiences no net force in a uniform field, only torque.",
            "Potential energy formula: U = -p · E = -pE cosθ.",
            "Stable equilibrium is at θ = 0° (aligned with E).",
            "Unstable equilibrium is at θ = 180° (opposite to E).",
            "Work done in rotating dipole from θ1 to θ2 is W = pE(cosθ1 - cosθ2)."
        ],
        "board_exam_tip": "A classic board question asks for the work done to rotate a dipole from stable equilibrium (θ = 0°) to unstable equilibrium (θ = 180°). Work done is W = pE(cos0° - cos180°) = pE(1 - (-1)) = 2pE.",
        "quick_recap": [
            "U = -pE cosθ.",
            "Stable equilibrium: θ = 0° (U = -pE).",
            "Unstable equilibrium: θ = 180° (U = +pE).",
            "Work done to rotate: W = pE(cosθ1 - cosθ2)."
        ],
        "reference_link": "https://www.youtube.com/watch?v=5Vj-FmOq8t4"
    },
    {
        "topic_no": 14,
        "title": "Electrostatics of Conductors",
        "explanation": (
            "Conductors contain free mobile charge carriers (electrons). "
            "When placed in an electrostatic field, the charges rearrange themselves instantly until a state of static equilibrium is reached. "
            "At this equilibrium, conductors exhibit several key properties:\n"
            "1. The electric field inside the conductor is zero.\n"
            "2. The net charge inside the conductor is zero (all excess charge resides entirely on the outer surface).\n"
            "3. The electric field just outside the surface is perpendicular to the surface at every point, with magnitude E = σ/ε0.\n"
            "4. The electrostatic potential is constant throughout the volume of the conductor and is equal to its value at the surface."
        ),
        "image_description": (
            "A cutaway diagram of a charged metal sphere. "
            "The center is labeled 'E = 0, Net Charge = 0'. "
            "All '+' charges are shown on the very outer boundary. "
            "Electric field lines exit the surface perpendicularly."
        ),
        "real_life_examples": [
            "A hollow metal ball connected to a battery holds all its charge on the outside; touching the inside surface yields no charge transfer.",
            "High-voltage electrical equipment is housed inside metal cabinets to prevent internal electric fields from leaking out and causing shock.",
            "Grounding wires: connecting a charged conductor to the earth causes all excess charge to flow to the earth, neutralizing the conductor."
        ],
        "important_points": [
            "Inside conductor: E = 0.",
            "Inside conductor: Net charge Q_enclosed = 0.",
            "Excess charge resides on the outer surface.",
            "Electrostatic potential is constant throughout the conductor's volume.",
            "At the surface, electric field is perpendicular and E = σ/ε0."
        ],
        "board_exam_tip": "If asked why E = 0 inside a conductor, explain: 'In an external field, free electrons drift opposite to the field, creating an induced field inside. This process continues until the induced field equals the external field, making the net field zero.'",
        "quick_recap": [
            "Inside conductor: E = 0, net charge = 0.",
            "Potential is constant everywhere inside (equipotential volume).",
            "Field is perpendicular to surface, E = σ/ε0."
        ],
        "reference_link": "https://www.youtube.com/watch?v=b4wS9-2w2rU"
    },
    {
        "topic_no": 15,
        "title": "Electrostatic Shielding",
        "explanation": (
            "Electrostatic shielding is the phenomenon of protecting a certain region of space from the influence of external electric fields. "
            "It is based on the property that the electric field inside a cavity of a conductor is always zero, regardless of the size, shape, or charge of the conductor, and regardless of any external field. "
            "Any external electric field lines will terminate on the outer surface of the conductor, leaving the interior cavity completely free from any electric fields."
        ),
        "image_description": (
            "An illustration of a hollow metal box (Faraday Cage) with lightning bolts striking it from the outside. "
            "Inside the box, a person or delicate instrument is shown completely safe, with 'E = 0' labeled inside the cavity."
        ),
        "real_life_examples": [
            "It is safer to remain inside a car during a lightning storm because the metallic body of the car acts as a Faraday cage, shielding the inside.",
            "Coaxial cables used for cable TV have an outer braided copper shield to prevent external electrical noise from disrupting the signal inside.",
            "Sensitive electronic components in laboratory devices are enclosed in metal shield cases to block static interference."
        ],
        "important_points": [
            "Electric field inside a cavity of a conductor is always zero.",
            "This effect is known as Faraday Cage effect.",
            "It shields sensitive instruments from external electrical disturbances.",
            "Charges on the outside rearrange to cancel external fields inside the cavity.",
            "No electric field lines can enter the cavity."
        ],
        "board_exam_tip": "If a board question asks why it is safer to be inside a car than under a tree during lightning, explain that the car's metallic body acts as an electrostatic shield (Faraday cage) so E = 0 inside.",
        "quick_recap": [
            "Electrostatic shielding blocks external electric fields using a hollow conductor cavity.",
            "Based on E = 0 inside conductor cavities.",
            "Used in Faraday cages, coaxial cables, and lab shield cases."
        ],
        "reference_link": "https://www.youtube.com/watch?v=2y4Oed9-6Xw"
    },
    {
        "topic_no": 16,
        "title": "Capacitors and Capacitance",
        "explanation": (
            "A capacitor is a device used to store electrical charge and electrical energy. "
            "It consists of two conductors separated by an insulator (dielectric). "
            "When a potential difference V is applied across the conductors, they acquire equal and opposite charges +Q and -Q. "
            "The charge Q stored is directly proportional to the potential difference V. "
            "The constant of proportionality is called capacitance (C).\n"
            "Formula:\n"
            "C = Q/V\n"
            "The SI unit of capacitance is Farad (F). Since Farad is a very large unit, we practically use microfarads (μF), nanofarads (nF), or picofarads (pF)."
        ),
        "image_description": (
            "A simple circuit diagram showing a battery connected to two parallel metal plates. "
            "One plate accumulates '+' charges, the other '-' charges. "
            "The formula C = Q/V and unit conversion factors (1μF = 10^-6 F) are displayed."
        ),
        "real_life_examples": [
            "The condenser (capacitor) in a ceiling fan stores charge to provide the high starting torque required to spin the motor.",
            "Keyboard keys: pressing a key changes the distance between two plates inside the keyboard, changing capacitance and registering the keystroke.",
            "Tuning circuits in radios use variable capacitors to select specific radio station frequencies by adjusting capacitance."
        ],
        "important_points": [
            "Capacitor stores charge and electrical energy.",
            "Capacitance C = Q/V is a constant for a given capacitor.",
            "C depends only on shape, size, spacing, and medium between conductors.",
            "C does not depend on Q or V themselves.",
            "SI unit is Farad (F), where 1 F = 1 C/V."
        ],
        "board_exam_tip": "State the definition of 1 Farad: 'Capacitance of a capacitor is 1 Farad if a charge of 1 Coulomb creates a potential difference of 1 Volt across its plates.'",
        "quick_recap": [
            "Capacitor stores electrical charge/energy.",
            "C = Q/V.",
            "Farad (F) is the SI unit. C depends only on geometry and dielectric medium."
        ],
        "reference_link": "https://www.youtube.com/watch?v=u-jigaMJT10"
    },
    {
        "topic_no": 17,
        "title": "Parallel Plate Capacitor",
        "explanation": (
            "A parallel plate capacitor is the simplest form of capacitor. "
            "It consists of two large parallel conducting plates of area A separated by a small distance d. "
            "When charged, an electric field E = σ/ε0 is established between the plates. "
            "By calculating the potential difference V = Ed, we find that the capacitance depends directly on the plate area A and inversely on the separation distance d.\n"
            "Formula:\n"
            "C = ε0 A/d\n"
            "where ε0 is the permittivity of free space (8.854 × 10⁻¹² F/m). "
            "To increase capacitance, we can increase the area of plates or bring them closer together."
        ),
        "image_description": (
            "A detailed 3D diagram of a parallel plate capacitor. "
            "Plates are labeled with Area A, charge +Q and -Q, and separation distance d. "
            "Uniform electric field lines are shown going from the positive to the negative plate."
        ),
        "real_life_examples": [
            "Studio microphones use a flexible diaphragm plate parallel to a fixed backplate; sound waves move the diaphragm, altering d and capacitance to record audio.",
            "Industrial touch screens use a grid of parallel micro-plates; touching changes the plate separation, altering capacitance to track finger position.",
            "High-power laboratory capacitors use large plates suspended close together in oil or vacuum to achieve high capacitance values."
        ],
        "important_points": [
            "Simplest capacitor model: two parallel plates.",
            "Capacitance C = ε0 A/d in vacuum.",
            "C is directly proportional to plate area A.",
            "C is inversely proportional to separation distance d.",
            "Electric field between plates is uniform and E = V/d."
        ],
        "board_exam_tip": "Be ready to derive the formula C = ε0 A/d. Remember the steps: 1. Write field E = σ/ε0 = Q/(Aε0). 2. Find potential V = E·d = Qd/(Aε0). 3. Calculate C = Q/V = ε0 A/d.",
        "quick_recap": [
            "Parallel plate capacitor: C = ε0 A/d.",
            "Capacitance increases with larger area (A) and smaller gap (d).",
            "Field between plates is E = V/d."
        ],
        "reference_link": "https://www.youtube.com/watch?v=F_fEaU1e52k"
    },
    {
        "topic_no": 18,
        "title": "Dielectrics and Polarisation",
        "explanation": (
            "Dielectrics are non-conducting materials (insulators) that contain no free charges. "
            "When a dielectric is placed in an external electric field, its molecules polarize (realign positive and negative charges internally), creating an induced opposite electric field inside the material. "
            "This reduces the net electric field between the plates of the capacitor. "
            "Since the electric field decreases (E = E0/K), the potential difference decreases (V = V0/K), causing the capacitance to increase by a factor K (dielectric constant).\n"
            "Formula with dielectric:\n"
            "C = K C0 = K ε0 A/d\n"
            "where K is the dielectric constant of the medium (K > 1)."
        ),
        "image_description": (
            "A diagram showing a parallel plate capacitor with a dielectric slab inserted between the plates. "
            "Polarized molecules (dipoles) inside the slab are shown aligned with the field, with induced surface charges on the dielectric boundaries canceling some of the main plate charge field."
        ),
        "real_life_examples": [
            "Commercial ceramic capacitors use high-K ceramic materials between plates to pack high capacitance in a tiny, pill-sized component.",
            "Water has a very high dielectric constant (K = 80), meaning placing water between plates would theoretically boost capacitance by 80 times (though water is conductive if not pure).",
            "Paper and plastic films are wrapped between foil sheets in cylindrical capacitors to both prevent short-circuits and increase capacitance."
        ],
        "important_points": [
            "Dielectric contains no free charge carriers, only bound charges.",
            "Polarisation induces surface charge on the dielectric slab.",
            "Induced field opposes external field, reducing net E-field: E = E0/K.",
            "Dielectric constant K is always greater than 1 for materials.",
            "Inserting a dielectric increases capacitance: C = K C0."
        ],
        "board_exam_tip": "Understand the difference when the battery remains connected vs when the battery is disconnected: 1. Battery connected: Potential V remains constant, charge Q increases. 2. Battery disconnected: Charge Q remains constant, potential V decreases.",
        "quick_recap": [
            "Dielectrics polarize in electric fields.",
            "Reduces net E-field by factor K (dielectric constant).",
            "Capacitance increases to C = K ε0 A/d."
        ],
        "reference_link": "https://www.youtube.com/watch?v=T47tH1V1eGo"
    },
    {
        "topic_no": 19,
        "title": "Capacitors in Series and Parallel",
        "explanation": (
            "Just like resistors, capacitors can be combined in circuits in two main configurations to achieve different total capacitances:\n"
            "1. **Series Combination**: Capacitors are connected end-to-end. The charge Q on each capacitor is the same, but the total potential difference is split among them. The equivalent capacitance (Cs) is smaller than the smallest individual capacitance.\n"
            "Formula (Series):\n"
            "1/Cs = 1/C1 + 1/C2 + 1/C3 + ...\n"
            "2. **Parallel Combination**: Capacitors are connected side-by-side across the same nodes. The potential difference V across each capacitor is the same, but the total charge is split. The equivalent capacitance (Cp) is the sum of individual capacitances.\n"
            "Formula (Parallel):\n"
            "Cp = C1 + C2 + C3 + ..."
        ),
        "image_description": (
            "A schematic diagram showing two sub-circuits. "
            "Circuit A shows three capacitors in a single line (series). "
            "Circuit B shows three capacitors stacked vertically connected to the same side rails (parallel). "
            "Formulas are written next to each configuration."
        ),
        "real_life_examples": [
            "In power supplies, parallel capacitors are added to smooth voltage ripples by creating a larger combined capacitance to store charge.",
            "To build high-voltage circuits, capacitors are connected in series so the high voltage is distributed across multiple components, preventing damage.",
            "Memory cells in computer RAM combine capacitors in complex arrays to selectively store binary bits (0 or 1)."
        ],
        "important_points": [
            "Series: Charge Q is same, voltages V add up. 1/Cs = Σ 1/Ci.",
            "Parallel: Voltage V is same, charges Q add up. Cp = Σ Ci.",
            "Series equivalent capacitance is always less than any individual capacitance.",
            "Parallel equivalent capacitance is always greater than any individual capacitance.",
            "For two capacitors in series: Cs = (C1 × C2) / (C1 + C2)."
        ],
        "board_exam_tip": "Do not confuse these formulas with resistors! Resistors in series add up directly (R = R1 + R2), whereas capacitors in parallel add up directly (C = C1 + C2). Double check your formulas during numericals.",
        "quick_recap": [
            "Series: 1/Cs = 1/C1 + 1/C2 + ... (Charge is same).",
            "Parallel: Cp = C1 + C2 + ... (Voltage is same).",
            "Capacitor formulas are opposite to resistor formulas."
        ],
        "reference_link": "https://www.youtube.com/watch?v=F_fEaU1e52k"
    },
    {
        "topic_no": 20,
        "title": "Energy Stored in a Capacitor",
        "explanation": (
            "The process of charging a capacitor involves transferring charge from one plate to another. "
            "Work must be done by the battery to move charges against the growing potential difference. "
            "This work is stored as electrostatic potential energy (U) in the electric field between the plates of the capacitor. "
            "By integrating the work done dW = V dq, we arrive at the energy equations.\n"
            "Formulas:\n"
            "U = 1/2 CV² = Q²/(2C) = 1/2 QV\n"
            "This energy is stored in the volume of the space between the plates, leading to the concept of energy density (u), which is energy per unit volume: u = 1/2 ε0 E²."
        ),
        "image_description": (
            "A diagram showing a charged capacitor with an energy symbol (glowing orb) in the space between the plates. "
            "The three equivalent formulas for U are written below in bold text."
        ),
        "real_life_examples": [
            "Defibrillators in hospitals use a large capacitor to store electrical energy (about 360 Joules) and discharge it into a patient's chest to restart the heart.",
            "Camera flash bulbs flash instantly because a capacitor dumps all its stored energy (1/2 CV²) in a fraction of a second, which a battery cannot do.",
            "Pulsed lasers discharge giant capacitor banks to emit highly intense bursts of light for cutting metals or surgeries."
        ],
        "important_points": [
            "Work done in charging a capacitor is stored as electric energy.",
            "Equivalent energy formulas: U = 1/2 CV² = Q²/(2C) = 1/2 QV.",
            "Energy is stored in the electric field between plates.",
            "Energy density (energy per unit volume) is u = 1/2 ε0 E².",
            "Only half the energy supplied by a battery is stored; the other half is lost as heat."
        ],
        "board_exam_tip": "A common conceptual question asks: 'If a dielectric is inserted with battery disconnected, what happens to stored energy?' Since Q is constant and C increases (KC0), energy U = Q²/(2C) decreases by factor K.",
        "quick_recap": [
            "Energy stored: U = 1/2 CV² = Q²/(2C) = 1/2 QV.",
            "Energy density: u = 1/2 ε0 E².",
            "Stored in the electric field between the plates."
        ],
        "reference_link": "https://www.youtube.com/watch?v=F_fEaU1e52k"
    }
]

# 60 quiz questions (3 per topic: 2 MCQs and 1 short answer)
CHAPTER_2_QUIZZES = [
    # Topic 1
    {"topic_no": 1, "question_type": "mcq", "question": "What happens to the potential energy of a system of two positive charges when the distance between them is decreased?", "option_a": "Decreases", "option_b": "Increases", "option_c": "Remains constant", "option_d": "Becomes zero", "correct_option": "B", "expected_answer": "As distance r decreases, potential energy U = k q1q2/r increases for like charges.", "marks": 1},
    {"topic_no": 1, "question_type": "mcq", "question": "What is the SI unit of electrostatic potential energy?", "option_a": "Farad", "option_b": "Volt", "option_c": "Joule", "option_d": "Newton/Coulomb", "correct_option": "C", "expected_answer": "The SI unit of all forms of energy is Joule (J).", "marks": 1},
    {"topic_no": 1, "question_type": "short_answer", "question": "Define electrostatic potential energy for a system of charges.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "Electrostatic potential energy is the work done in bringing the charges from infinity to their respective positions to assemble the system.", "marks": 2},

    # Topic 2
    {"topic_no": 2, "question_type": "mcq", "question": "The work done by a conservative force along a closed path is:", "option_a": "Positive", "option_b": "Negative", "option_c": "Zero", "option_d": "Infinite", "correct_option": "C", "expected_answer": "By definition, work done by any conservative force in a closed loop is zero.", "marks": 1},
    {"topic_no": 2, "question_type": "mcq", "question": "Which of the following forces is non-conservative?", "option_a": "Electrostatic force", "option_b": "Gravitational force", "option_c": "Frictional force", "option_d": "Magnetic force", "correct_option": "C", "expected_answer": "Friction is a non-conservative force because work done depends on the path length.", "marks": 1},
    {"topic_no": 2, "question_type": "short_answer", "question": "Why is work done in a closed path zero for electrostatic forces?", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "Because electrostatic force is conservative in nature, making the work done path-independent; thus, returning to the start yields zero net change.", "marks": 2},

    # Topic 3
    {"topic_no": 3, "question_type": "mcq", "question": "Electrostatic potential is a:", "option_a": "Scalar quantity", "option_b": "Vector quantity", "option_c": "Tensor quantity", "option_d": "Dimensionless quantity", "correct_option": "A", "expected_answer": "Potential is work done per unit charge, which is a scalar quantity.", "marks": 1},
    {"topic_no": 3, "question_type": "mcq", "question": "One Volt is equivalent to:", "option_a": "1 Joule / Coulomb", "option_b": "1 Coulomb / Joule", "option_c": "1 Newton / Coulomb", "option_d": "1 Joule * Coulomb", "correct_option": "A", "expected_answer": "Since V = W/q, 1 Volt = 1 Joule per 1 Coulomb.", "marks": 1},
    {"topic_no": 3, "question_type": "short_answer", "question": "Define 1 Volt of electrostatic potential.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "One Volt is the potential at a point when 1 Joule of work is done in bringing 1 Coulomb of positive charge from infinity to that point.", "marks": 2},

    # Topic 4
    {"topic_no": 4, "question_type": "mcq", "question": "A positive charge placed in an electric field will naturally tend to move from:", "option_a": "Lower potential to higher potential", "option_b": "Higher potential to lower potential", "option_c": "Equatorial line to axial line", "option_d": "Infinity to the origin", "correct_option": "B", "expected_answer": "Positive charges flow down the potential gradient, i.e., from high to low potential.", "marks": 1},
    {"topic_no": 4, "question_type": "mcq", "question": "Work done in moving a charge Q through a potential difference V is:", "option_a": "Q / V", "option_b": "V / Q", "option_c": "Q * V", "option_d": "1 / (Q * V)", "correct_option": "C", "expected_answer": "Work done is given by W = Q * ΔV.", "marks": 1},
    {"topic_no": 4, "question_type": "short_answer", "question": "What is potential difference?", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "Potential difference between two points is the work done in moving a unit positive charge from one point to the other without acceleration.", "marks": 2},

    # Topic 5
    {"topic_no": 5, "question_type": "mcq", "question": "How does the electric potential V vary with distance r from a point charge?", "option_a": "V ∝ 1/r²", "option_b": "V ∝ 1/r", "option_c": "V ∝ r", "option_d": "V ∝ r²", "correct_option": "B", "expected_answer": "Potential due to point charge is V = kQ/r, which means V is inversely proportional to r.", "marks": 1},
    {"topic_no": 5, "question_type": "mcq", "question": "If charge Q is negative, the potential at distance r is:", "option_a": "Positive", "option_b": "Negative", "option_c": "Zero", "option_d": "Imaginary", "correct_option": "B", "expected_answer": "Potential V = kQ/r keeps the sign of the source charge, so negative charges create negative potential.", "marks": 1},
    {"topic_no": 5, "question_type": "short_answer", "question": "Write the formula for potential due to a point charge Q at distance r, defining the symbols.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "V = 1/(4πε0) * Q/r, where Q is the charge, r is the distance, and ε0 is the permittivity of free space.", "marks": 2},

    # Topic 6
    {"topic_no": 6, "question_type": "mcq", "question": "The electric potential due to a dipole at a point on its equatorial line is:", "option_a": "Maximum", "option_b": "Minimum", "option_c": "Zero", "option_d": "Infinite", "correct_option": "C", "expected_answer": "On the equatorial line, θ = 90°, so V = k p cos(90°)/r² = 0.", "marks": 1},
    {"topic_no": 6, "question_type": "mcq", "question": "At large distances, the potential due to a dipole decays as:", "option_a": "1/r", "option_b": "1/r²", "option_c": "1/r³", "option_d": "1/r⁴", "correct_option": "B", "expected_answer": "Dipole potential V is proportional to 1/r², which is faster than a point charge's 1/r.", "marks": 1},
    {"topic_no": 6, "question_type": "short_answer", "question": "What is the formula for the potential of an electric dipole along its axial line?", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "V = ± 1/(4πε0) * p/r², depending on whether the point is near the positive or negative charge.", "marks": 2},

    # Topic 7
    {"topic_no": 7, "question_type": "mcq", "question": "To find the net potential due to a system of charges, we use:", "option_a": "Vector addition", "option_b": "Algebraic addition", "option_c": "Cross product multiplication", "option_d": "Integration only", "correct_option": "B", "expected_answer": "Potential is a scalar, so we add potentials algebraically (as normal numbers with signs).", "marks": 1},
    {"topic_no": 7, "question_type": "mcq", "question": "Two charges +5V potential and -5V potential at point P combine to give a net potential of:", "option_a": "10 V", "option_b": "-10 V", "option_c": "0 V", "option_d": "25 V", "correct_option": "C", "expected_answer": "Net potential V = V1 + V2 = +5 - 5 = 0 V.", "marks": 1},
    {"topic_no": 7, "question_type": "short_answer", "question": "State the principle of superposition for electric potential.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "The electric potential at any point due to a system of point charges is the algebraic sum of the potentials due to individual charges at that point.", "marks": 2},

    # Topic 8
    {"topic_no": 8, "question_type": "mcq", "question": "For a surface charge distribution, the charge element dq is written as:", "option_a": "λ dl", "option_b": "σ dS", "option_c": "ρ dV", "option_d": "Q / V", "correct_option": "B", "expected_answer": "dq = σ dS, where σ is surface charge density and dS is area element.", "marks": 1},
    {"topic_no": 8, "question_type": "mcq", "question": "What is the potential at the center of a uniformly charged thin ring of radius R and total charge Q?", "option_a": "Zero", "option_b": "Q / (4πε0 R)", "option_c": "Q / (4πε0 R²)", "option_d": "Q * R / (4πε0)", "correct_option": "B", "expected_answer": "At center of a ring, all charge elements are at equal distance R, so V = kQ/R.", "marks": 1},
    {"topic_no": 8, "question_type": "short_answer", "question": "Write the general integral formula for potential due to continuous charge distribution.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "V = ∫ 1/(4πε0) * dq/r, integrated over the entire charge volume.", "marks": 2},

    # Topic 9
    {"topic_no": 9, "question_type": "mcq", "question": "The angle between electric field lines and an equipotential surface is always:", "option_a": "0°", "option_b": "45°", "option_c": "90°", "option_d": "180°", "correct_option": "C", "expected_answer": "Electric field lines are always perpendicular (90°) to equipotential surfaces.", "marks": 1},
    {"topic_no": 9, "question_type": "mcq", "question": "Work done in moving a charge Q on an equipotential surface is:", "option_a": "Q * V", "option_b": "Q / V", "option_c": "Zero", "option_d": "Infinite", "correct_option": "C", "expected_answer": "Since potential difference ΔV = 0 on equipotential surface, W = Q * ΔV = 0.", "marks": 1},
    {"topic_no": 9, "question_type": "short_answer", "question": "Why can two equipotential surfaces never intersect each other?", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "If they intersected, the point of intersection would have two different potentials, which is physically impossible.", "marks": 2},

    # Topic 10
    {"topic_no": 10, "question_type": "mcq", "question": "The relation between electric field E and potential V is:", "option_a": "E = dV/dr", "option_b": "E = -dV/dr", "option_c": "E = V * r", "option_d": "E = -V/r²", "correct_option": "B", "expected_answer": "E = -dV/dr represents that electric field is negative potential gradient.", "marks": 1},
    {"topic_no": 10, "question_type": "mcq", "question": "The negative sign in E = -dV/dr indicates that:", "option_a": "Field points in direction of increasing potential", "option_b": "Field points in direction of decreasing potential", "option_c": "Potential is always negative", "option_d": "Field is always negative", "correct_option": "B", "expected_answer": "The negative sign shows that electric field points in the direction where potential decreases.", "marks": 1},
    {"topic_no": 10, "question_type": "short_answer", "question": "If potential V is constant in a region, what is the electric field there?", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "The electric field is zero because E = -dV/dr, and the derivative of a constant is zero.", "marks": 2},

    # Topic 11
    {"topic_no": 11, "question_type": "mcq", "question": "For a system of three point charges, how many pairs of potential energy terms are summed?", "option_a": "One", "option_b": "Two", "option_c": "Three", "option_d": "Six", "correct_option": "C", "expected_answer": "For N=3, pairs are q1-q2, q2-q3, q1-q3, giving 3 terms.", "marks": 1},
    {"topic_no": 11, "question_type": "mcq", "question": "The mutual potential energy of a positive charge and a negative charge is:", "option_a": "Positive", "option_b": "Negative", "option_c": "Zero", "option_d": "Infinite", "correct_option": "B", "expected_answer": "U = k q1q2/r. Since one charge is negative, the product q1q2 is negative, making U negative.", "marks": 1},
    {"topic_no": 11, "question_type": "short_answer", "question": "Write the expression for the potential energy of a system of two charges in vacuum.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "U = 1/(4πε0) * q1q2/r, where q1 and q2 are charges and r is distance between them.", "marks": 2},

    # Topic 12
    {"topic_no": 12, "question_type": "mcq", "question": "A charge Q is placed at a point where the external electric potential is V. Its potential energy is:", "option_a": "Q / V", "option_b": "V / Q", "option_c": "Q * V", "option_d": "1/2 Q * V", "correct_option": "C", "expected_answer": "U = Q * V is the potential energy of a charge Q in an external potential V.", "marks": 1},
    {"topic_no": 12, "question_type": "mcq", "question": "When computing potential energy in an external field for two charges, we sum:", "option_a": "Only their mutual interaction", "option_b": "Only their external potential interactions", "option_c": "Both external potential interactions and their mutual interaction", "option_d": "None of the above", "correct_option": "C", "expected_answer": "Total U = q1V(r1) + q2V(r2) + k q1q2/r12.", "marks": 1},
    {"topic_no": 12, "question_type": "short_answer", "question": "What does V(r) represent in external field potential energy formulas?", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "V(r) represents the electric potential at position vector r due to external source charges.", "marks": 2},

    # Topic 13
    {"topic_no": 13, "question_type": "mcq", "question": "A dipole is in stable equilibrium in a uniform field when the angle between dipole moment and field is:", "option_a": "0°", "option_b": "90°", "option_c": "180°", "option_d": "270°", "correct_option": "A", "expected_answer": "At θ = 0°, potential energy is minimum (U = -pE), representing stable equilibrium.", "marks": 1},
    {"topic_no": 13, "question_type": "mcq", "question": "The potential energy of a dipole placed perpendicular (θ = 90°) to electric field is:", "option_a": "-pE", "option_b": "pE", "option_c": "Zero", "option_d": "Infinite", "correct_option": "C", "expected_answer": "U = -pE cos(90°) = 0.", "marks": 1},
    {"topic_no": 13, "question_type": "short_answer", "question": "What is the potential energy of a dipole in unstable equilibrium?", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "U = +pE, which occurs when the dipole is aligned opposite to the field (θ = 180°).", "marks": 2},

    # Topic 14
    {"topic_no": 14, "question_type": "mcq", "question": "The net electric field inside a charged conductor in electrostatic equilibrium is:", "option_a": "Infinite", "option_b": "Varies linearly", "option_c": "Zero", "option_d": "Dependent on external field", "correct_option": "C", "expected_answer": "In electrostatics, the net electric field inside a conductor is always zero.", "marks": 1},
    {"topic_no": 14, "question_type": "mcq", "question": "Any excess charge given to an isolated conductor resides:", "option_a": "At its center", "option_b": "Resides entirely on its outer surface", "option_c": "Resides evenly inside its volume", "option_d": "Leaks out instantly", "correct_option": "B", "expected_answer": "Charges repel each other and move as far apart as possible, residing entirely on the outer surface.", "marks": 1},
    {"topic_no": 14, "question_type": "short_answer", "question": "What is the relation of electrostatic potential inside and at the surface of a conductor?", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "The potential is constant throughout the volume of the conductor and is equal to the potential at the surface.", "marks": 2},

    # Topic 15
    {"topic_no": 15, "question_type": "mcq", "question": "The phenomenon of protecting a region from external electric fields is called:", "option_a": "Electrostatic induction", "option_b": "Electrostatic shielding", "option_c": "Dielectric breakdown", "option_d": "Corona discharge", "correct_option": "B", "expected_answer": "This is the definition of electrostatic shielding.", "marks": 1},
    {"topic_no": 15, "question_type": "mcq", "question": "A Faraday cage is built using a:", "option_a": "Insulating cylinder", "option_b": "Conducting shell/mesh", "option_c": "Wood blocks", "option_d": "Glass box", "correct_option": "B", "expected_answer": "A Faraday cage requires conducting material to distribute charge on its surface, making E=0 inside.", "marks": 1},
    {"topic_no": 15, "question_type": "short_answer", "question": "Explain why it is safer to be inside a car than under a tree during a thunderstorm.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "The car's metallic body acts as an electrostatic shield (Faraday cage), making the electric field inside zero and keeping you safe.", "marks": 3},

    # Topic 16
    {"topic_no": 16, "question_type": "mcq", "question": "The capacitance of a capacitor is defined as:", "option_a": "C = V/Q", "option_b": "C = Q/V", "option_c": "C = Q * V", "option_d": "C = 1/2 Q * V", "correct_option": "B", "expected_answer": "C = Q/V is the definition of capacitance.", "marks": 1},
    {"topic_no": 16, "question_type": "mcq", "question": "What is the SI unit of capacitance?", "option_a": "Volt", "option_b": "Coulomb", "option_c": "Farad", "option_d": "Joule", "correct_option": "C", "expected_answer": "Farad (F) is the SI unit of capacitance.", "marks": 1},
    {"topic_no": 16, "question_type": "short_answer", "question": "Does capacitance depend on the charge Q or voltage V? Explain.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "No, capacitance is a constant for a given capacitor and depends only on geometric shape, size, spacing, and the dielectric medium.", "marks": 2},

    # Topic 17
    {"topic_no": 17, "question_type": "mcq", "question": "The capacitance of a parallel plate capacitor in vacuum is:", "option_a": "C = ε0 A/d", "option_b": "C = ε0 d/A", "option_c": "C = A/d", "option_d": "C = ε0 A * d", "correct_option": "A", "expected_answer": "The standard formula is C = ε0 A/d.", "marks": 1},
    {"topic_no": 17, "question_type": "mcq", "question": "If you double the distance d between parallel plates, the capacitance becomes:", "option_a": "Double", "option_b": "Four times", "option_c": "Halved", "option_d": "One-fourth", "correct_option": "C", "expected_answer": "Since C is inversely proportional to d, doubling d halves the capacitance.", "marks": 1},
    {"topic_no": 17, "question_type": "short_answer", "question": "State two ways to increase the capacitance of a parallel plate capacitor.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "1. Increase the plate area A. 2. Decrease the plate separation d. (Also, insert a dielectric medium with high K).", "marks": 2},

    # Topic 18
    {"topic_no": 18, "question_type": "mcq", "question": "When a dielectric slab is inserted in a capacitor with battery disconnected, potential V:", "option_a": "Increases", "option_b": "Decreases", "option_c": "Remains constant", "option_d": "Becomes zero", "correct_option": "B", "expected_answer": "With battery disconnected, charge Q is constant. C increases (KC0), so potential V = Q/C decreases to V0/K.", "marks": 1},
    {"topic_no": 18, "question_type": "mcq", "question": "Inserting a dielectric of constant K between plates increases capacitance by a factor of:", "option_a": "1/K", "option_b": "K", "option_c": "K²", "option_d": "1/K²", "correct_option": "B", "expected_answer": "C = K * C0. The capacitance is multiplied by K.", "marks": 1},
    {"topic_no": 18, "question_type": "short_answer", "question": "Explain what is dielectric polarisation.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "Dielectric polarisation is the alignment of molecular dipoles in a dielectric material along the direction of an external electric field.", "marks": 2},

    # Topic 19
    {"topic_no": 19, "question_type": "mcq", "question": "For two capacitors C1 and C2 in series, equivalent Cs is:", "option_a": "C1 + C2", "option_b": "C1 * C2 / (C1 + C2)", "option_c": "(C1 + C2) / (C1 * C2)", "option_d": "1/C1 + 1/C2", "correct_option": "B", "expected_answer": "Cs = 1/(1/C1 + 1/C2) = C1*C2/(C1+C2).", "marks": 1},
    {"topic_no": 19, "question_type": "mcq", "question": "When capacitors are connected in parallel, which quantity is same across each?", "option_a": "Charge Q", "option_b": "Potential difference V", "option_c": "Stored energy U", "option_d": "Electric field E", "correct_option": "B", "expected_answer": "In parallel combination, the voltage across each capacitor is the same.", "marks": 1},
    {"topic_no": 19, "question_type": "short_answer", "question": "Three capacitors of 3μF each are connected in parallel. What is their equivalent capacitance?", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "Cp = C1 + C2 + C3 = 3 + 3 + 3 = 9 μF.", "marks": 2},

    # Topic 20
    {"topic_no": 20, "question_type": "mcq", "question": "Which of the following is NOT an expression for energy stored in a capacitor?", "option_a": "1/2 CV²", "option_b": "Q²/(2C)", "option_c": "1/2 QV", "option_d": "1/2 QV²", "correct_option": "D", "expected_answer": "U = 1/2 QV² is incorrect. The correct formulas are 1/2 CV², Q²/2C, and 1/2 QV.", "marks": 1},
    {"topic_no": 20, "question_type": "mcq", "question": "The energy density in the electric field between plates is proportional to:", "option_a": "E", "option_b": "E²", "option_c": "1/E", "option_d": "1/E²", "correct_option": "B", "expected_answer": "Energy density u = 1/2 ε0 E², which is proportional to E².", "marks": 1},
    {"topic_no": 20, "question_type": "short_answer", "question": "Where is the energy of a capacitor stored?", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "The energy is stored in the electric field in the space between the conducting plates.", "marks": 2}
]

# 20 chapter test questions for Chapter 2
# 7 Remembering, 7 Understanding, 6 Applying/scenario-based
CHAPTER_2_TESTS = [
    # 7 Remembering (MCQs, 1 mark each or 2 marks)
    {"question_type": "mcq", "question": "What is the value of electric potential at any point on the equatorial line of an electric dipole?", "option_a": "Maximum", "option_b": "Zero", "option_c": "Minimum", "option_d": "Infinite", "correct_option": "B", "expected_answer": "Zero", "marks": 1, "bloom_level": "Remembering"},
    {"question_type": "mcq", "question": "The SI unit of capacitance is named after which scientist?", "option_a": "Coulomb", "option_b": "Alessandro Volta", "option_c": "Michael Faraday", "option_d": "Ampere", "correct_option": "C", "expected_answer": "Michael Faraday", "marks": 1, "bloom_level": "Remembering"},
    {"question_type": "mcq", "question": "Inside a cavity of a charged conductor, the electric field is:", "option_a": "Positive", "option_b": "Zero", "option_c": "Negative", "option_d": "Infinite", "correct_option": "B", "expected_answer": "Zero", "marks": 1, "bloom_level": "Remembering"},
    {"question_type": "mcq", "question": "The dielectric constant K for metal is:", "option_a": "Zero", "option_b": "One", "option_c": "Infinite", "option_d": "Ten", "correct_option": "C", "expected_answer": "Infinite", "marks": 1, "bloom_level": "Remembering"},
    {"question_type": "mcq", "question": "Which of the following is a scalar quantity?", "option_a": "Electric field intensity", "option_b": "Electric dipole moment", "option_c": "Electrostatic potential", "option_d": "Electrostatic force", "correct_option": "C", "expected_answer": "Electrostatic potential", "marks": 1, "bloom_level": "Remembering"},
    {"question_type": "mcq", "question": "What is the formula of capacitance for a parallel plate capacitor in vacuum?", "option_a": "C = ε0 A/d", "option_b": "C = A d / ε0", "option_c": "C = ε0 d/A", "option_d": "C = K ε0 A/d", "correct_option": "A", "expected_answer": "C = ε0 A/d", "marks": 1, "bloom_level": "Remembering"},
    {"question_type": "mcq", "question": "The energy density between the plates of a parallel plate capacitor is:", "option_a": "1/2 ε0 E²", "option_b": "1/2 C V²", "option_c": "Q² / 2C", "option_d": "E² / (2ε0)", "correct_option": "A", "expected_answer": "1/2 ε0 E²", "marks": 1, "bloom_level": "Remembering"},

    # 7 Understanding (Short Answer, 2 or 3 marks)
    {"question_type": "short_answer", "question": "Why is the potential constant inside and on the surface of a charged conductor?", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "Because the electric field inside a conductor in electrostatic equilibrium is zero (E = 0). Since E = -dV/dr, a zero electric field means the potential derivative dV/dr = 0, indicating V must be constant throughout the conductor.", "marks": 3, "bloom_level": "Understanding"},
    {"question_type": "short_answer", "question": "Explain why electric field lines are always perpendicular to equipotential surfaces.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "If they were not perpendicular, the electric field would have a non-zero component along the surface. Work would then be required to move a charge along the surface (W = F · dl != 0). This contradicts the definition of an equipotential surface where V is constant and W = 0.", "marks": 3, "bloom_level": "Understanding"},
    {"question_type": "short_answer", "question": "Why does the capacitance of a capacitor increase when a dielectric slab is inserted between its plates?", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "Inserting a dielectric causes polarization, creating an induced field that opposes the external field. This reduces the net electric field (E = E0/K), which lowers the potential difference V across the plates (V = V0/K). Since C = Q/V, a smaller V for the same charge Q results in a larger capacitance (C = K*C0).", "marks": 3, "bloom_level": "Understanding"},
    {"question_type": "short_answer", "question": "Deduce the relation between electric field and electrostatic potential.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "The work done in moving a unit positive charge by distance dr against an electric field E is dW = -E dr. This work is stored as potential difference dV = dW. Therefore, dV = -E dr, which gives E = -dV/dr. Electric field is the negative potential gradient.", "marks": 3, "bloom_level": "Understanding"},
    {"question_type": "short_answer", "question": "Derive the equivalent capacitance formula for two capacitors C1 and C2 in series.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "In series, the charge Q is same on both capacitors. The total voltage V is the sum of voltages across each: V = V1 + V2. Since V = Q/C, we can write Q/Cs = Q/C1 + Q/C2. Dividing both sides by Q gives the equivalent series capacitance relation: 1/Cs = 1/C1 + 1/C2.", "marks": 3, "bloom_level": "Understanding"},
    {"question_type": "short_answer", "question": "Explain the difference between polar and non-polar dielectrics with examples.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "Polar dielectrics have molecules with permanent dipole moments because the centers of positive and negative charges do not coincide (e.g., H2O, HCl). Non-polar dielectrics have molecules whose centers of positive and negative charges coincide, meaning they have zero permanent dipole moment in the absence of a field (e.g., O2, H2).", "marks": 3, "bloom_level": "Understanding"},
    {"question_type": "short_answer", "question": "Show that the equivalent capacitance of two capacitors C1 and C2 connected in parallel is Cp = C1 + C2.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "In parallel, both capacitors share the same potential difference V. The total charge Q is the sum of charges: Q = Q1 + Q2. Since Q = C * V, we get Cp * V = C1 * V + C2 * V. Dividing both sides by V yields the equivalent capacitance formula: Cp = C1 + C2.", "marks": 3, "bloom_level": "Understanding"},

    # 6 Applying/scenario-based (5 marks each)
    {"question_type": "scenario", "question": "A capacitor of capacitance C0 is charged to potential V0 by a battery. The battery is then disconnected, and a dielectric slab of constant K is inserted. What changes occur to (a) Charge, (b) Capacitance, (c) Potential Difference, and (d) Stored Energy? Explain.", "scenario_context": "Battery is disconnected after charging, and dielectric is inserted.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "1. Charge (Q) remains constant because the battery is disconnected. 2. Capacitance (C) increases to K*C0. 3. Potential difference decreases to V0/K because V = Q/C. 4. Stored energy decreases by factor K (U = U0/K) because energy is used to polarize the dielectric.", "marks": 5, "bloom_level": "Applying"},
    {"question_type": "scenario", "question": "A capacitor of capacitance C0 is charged to potential V0 by a battery. The battery remains connected, and a dielectric slab of constant K is inserted. What changes occur to (a) Charge, (b) Capacitance, (c) Potential Difference, and (d) Stored Energy? Explain.", "scenario_context": "Battery remains connected, and dielectric is inserted.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "1. Potential difference (V) remains constant because the battery is still connected. 2. Capacitance (C) increases to K*C0. 3. Charge (Q) increases to K*Q0 because Q = C*V. 4. Stored energy increases to K*U0 because U = 1/2 C V² and C is multiplied by K while V is constant.", "marks": 5, "bloom_level": "Applying"},
    {"question_type": "scenario", "question": "During a massive thunderstorm, a student is caught in an open field. They see a car and a tall oak tree nearby. Based on your knowledge of electrostatics and shielding, describe where the student should go to seek safety and explain the physics behind this decision.", "scenario_context": "Seeking safety during lightning near a tree and a car.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "The student must go inside the car. The metallic body of the car acts as a Faraday Cage, providing electrostatic shielding. Inside the cavity, the electric field is zero (E = 0). Any lightning strike will pass along the outer surface of the car to the ground, keeping the interior safe. Seeking shelter under a tree is dangerous because the tree is a tall path for lightning and does not shield the area.", "marks": 5, "bloom_level": "Applying"},
    {"question_type": "scenario", "question": "Two charges +3μC and -3μC are placed 10 cm apart. Find the coordinates of the points along the line joining them where the net electric potential is zero. Take the positive charge at origin.", "scenario_context": "Finding points of zero potential for a dipole-like system.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "Let the point P be at distance x from the origin (+3μC). The other charge is at 10 cm. Potential is V = k[3/x - 3/|10 - x|] = 0. Case 1: Point is between charges: 3/x = 3/(10-x) => x = 5 cm. Case 2: Point is outside, to the left/right. On the left, negative potential dominates. On the right, x > 10, 3/x = 3/(x-10) has no real solution other than infinity. Thus, the only finite point of zero potential on the line is at the midpoint (5 cm from the origin).", "marks": 5, "bloom_level": "Applying"},
    {"question_type": "scenario", "question": "A parallel plate capacitor with plate area A and separation d is charged. A metal plate of thickness t (where t < d) is inserted between the plates. Calculate the new capacitance of the system and explain how it compares to the original capacitance.", "scenario_context": "Inserting a metal slab inside a parallel plate capacitor.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "The electric field inside the metal slab of thickness t is zero. The field exists only in the remaining space of thickness (d - t). The potential difference V = E * (d - t) = (Q / ε0 A) * (d - t). The new capacitance C = Q/V = ε0 A / (d - t). Since (d - t) < d, the denominator is smaller, which means the capacitance increases compared to the original capacitance C0 = ε0 A/d.", "marks": 5, "bloom_level": "Applying"},
    {"question_type": "scenario", "question": "An electrical technician needs a capacitance of 2μF in a circuit, but has a bundle of 1μF capacitors that can each withstand a maximum voltage of 50V. The total potential across the circuit is 100V. Describe how the technician can combine the capacitors to safely achieve the goal.", "scenario_context": "Combining capacitors to meet voltage and capacitance requirements.", "option_a": "", "option_b": "", "option_c": "", "option_d": "", "correct_option": "", "expected_answer": "Since each capacitor can withstand 50V, and total potential is 100V, the technician must connect at least two capacitors in series. A series pair of 1μF capacitors has a capacitance of 1/2 μF and can safely withstand 100V. To achieve the target of 2μF, the technician needs 4 such series branches in parallel. Each branch provides 0.5μF, and 4 branches in parallel give 4 * 0.5 = 2μF. So the technician must use a grid of 8 capacitors total (4 parallel branches, each having 2 capacitors in series).", "marks": 5, "bloom_level": "Applying"}
]
